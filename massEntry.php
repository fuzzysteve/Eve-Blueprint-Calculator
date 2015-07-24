<?php
require_once 'includes/head.php';

$smarty->assign('auth_characterid', $_SESSION['auth_characterid'], true);


if ($_POST['submit']=='ISK/HR') {

    if (array_key_exists('masslist', $_POST)) {
         $entries=explode("\n", $_POST['masslist']);
    } else {
        header("HTTP/1.1 500 Internal Server Error");
        echo "No Entries provided";
        exit;
    }
    if (isset($_REQUEST['system'])) {
        $systemname=$_REQUEST['system'];
        $solarsystemsql='SELECT solarSystemID,solarSystemName FROM mapSolarSystems WHERE LOWER(solarSystemName)=lower(?)';
    } else {
        header("HTTP/1.1 500 Internal Server Error");
        echo "No solarsystem";
        exit;
    }
    $systemstmt = $dbh->prepare($solarsystemsql);
    $systemstmt->execute(array($systemname));

    if ($row = $systemstmt->fetchObject()) {
        $solarsystemid=(int)$row->solarSystemID;
        $solarsystemname=$row->solarSystemName;
    } else {
        $solarsystemid=30000142;
        $solarsystemname='Jita';
    }


    $sql=<<<EOS
    select typename,invTypes.typeid,producttypeid 
    from invTypes 
    join industryBlueprints on invTypes.typeid=industryBlueprints.typeid 
    join industryActivityProducts on (invTypes.typeid=industryActivityProducts.typeid and industryActivityProducts.activityid=1)
    where invTypes.published=1
EOS;

    $stmt = $dbh->prepare($sql);

    $stmt->execute();
    $typeidlookup=array();
    $typenamelookup=array();
    while ($row = $stmt->fetchObject()) {
        $typeidlookup[$row->typename]=$row->typeid;
        $typenamelookup[$row->typeid]=$row->typename;
        $productlookup[$row->typeid]=$row->producttypeid;
    }


    $inventory=array();

    foreach ($entries as $entry) {
        $entry=str_replace(",", "", $entry);
        if (preg_match(
            "/^\d+?\t\d+?\t(\d+?)\t[\w\s]+\t\d+?\t(\-?\d+?)\t(\d+?)\t(\d+?)\t(\-?\d+?)$/",
            trim($entry),
            $matches
        )) {
            if (isset($typenamelookup[$matches[1]])) {
                $quantity=1;
                if (is_numeric($matches[2])) {
                    $quantity=$matches[2];
                }
                if (isset($inventory[$matches[1]."/".$matches[5]."/".$matches[4]."/".$matches[3]])) {
                    $inventory[$matches[1]."/".$matches[5]."/".$matches[4]."/".$matches[3]]+=$quantity;
                } else {
                    $inventory[$matches[1]."/".$matches[5]."/".$matches[4]."/".$matches[3]]=$quantity;
                }
            }
        }
    }

    $blueprintsql=<<<EOS
    SELECT sum(ceil(round(greatest(:runs,(quantity*:memod*:facilitymod)*:runs),2))*price) priceTotal
    FROM industryActivityMaterials 
    JOIN evesupport.sellprices on (sellprices.typeid=industryActivityMaterials.materialTypeID and region=10000002)
    WHERE industryActivityMaterials.typeid=:typeid 
    AND activityid=1 
EOS;
    $blueprintstmt=$dbh->prepare($blueprintsql);
    $costsql=<<<EOS
    SELECT round(sum((quantity*:runs)*adjustedprice)*costIndex,2) costTotal
    FROM industryActivityMaterials 
    JOIN evesupport.priceData on (priceData.typeid=industryActivityMaterials.materialTypeID)
    join evesupport.costIndex on (industryActivityMaterials.activityid=costIndex.activityid and solarsystemid=:solarsystemid)
    WHERE industryActivityMaterials.typeid=:typeid
    AND industryActivityMaterials.activityid=1
EOS;
    $coststmt=$dbh->prepare($costsql);
    $timesql=<<<EOS
    SELECT typeid,time 
    FROM industryActivity
    WHERE typeid=:typeid
    AND activityID=1
EOS;
    $timestmt=$dbh->prepare($timesql);

    $pricesql=<<<EOS
    SELECT price*quantity price
    FROM industryActivityProducts
    JOIN evesupport.sellprices on (sellprices.typeid=industryActivityProducts.productTypeID and region=10000002)
    WHERE industryActivityProducts.typeid=:typeid
    AND activityid=1
EOS;
    $pricestmt=$dbh->prepare($pricesql);



    $facility=1;
    $solarsystemid=30000142;
    $blueprints=array();
    foreach (array_keys($inventory) as $blueprint) {
        
        list($typeid, $copy, $me, $te)=explode("/", $blueprint);
        $timestmt->execute(array(":typeid"=>$typeid));
        $timerow = $timestmt->fetchObject();
        $memod=1-($me/100);
        $duration=$timerow->time*(1-$te/100)*0.8*0.85;
        if ($copy == -1) {
            $runs=max(1, floor(86400/$duration));
        } else {
            $runs=$copy;
        }
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $blueprintstmt->execute(array(":typeid"=>$typeid,":memod"=>$memod,":runs"=>$runs,":facilitymod"=>$facility));
        $blueprintrow = $blueprintstmt->fetchObject();
        $coststmt->execute(array(":typeid"=>$typeid,":solarsystemid"=>$solarsystemid,":runs"=>$runs));
        $costrow = $coststmt->fetchObject();
        $pricestmt->execute(array(":typeid"=>$typeid));
        $pricerow = $pricestmt->fetchObject();
        $iskhr=((($pricerow->price*$runs)-($blueprintrow->priceTotal+$costrow->costTotal))/($duration*$runs))*3600;
        $iskhr24=((($pricerow->price*$runs)-($blueprintrow->priceTotal+$costrow->costTotal))/(ceil(($duration*$runs)/86400)))/24;
        $blueprints[]=array(
            "copy"=>($copy)==-1?false:true,
            "typeid"=>$typeid,
            "name"=>$typenamelookup[$typeid],
            "runs"=>$runs,
            "materialcost"=>number_format($blueprintrow->priceTotal, 2),
            "buildcost"=>number_format($costrow->costTotal, 2),
            "duration"=>number_format($duration*$runs, 2),
            "iskhr"=>number_format($iskhr, 2),
            "iskhr24"=>number_format($iskhr24, 2),
            "jitaprice"=>number_format($pricerow->price, 2),
            "profit"=>number_format(($pricerow->price*$runs)-($blueprintrow->priceTotal+$costrow->costTotal), 2)
            );

    }
    $smarty->assign('systemname', $solarsystemname, true);
    $smarty->assign('blueprints', $blueprints, true);
    $smarty->display('massenter.tpl');
} else {
    $smarty->display('enterlist.tpl');
}
