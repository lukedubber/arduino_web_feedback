<?php
$arr = array('inputs' => array ('a'=>1,'b'=>2,'c'=>3,'d'=>4,'e'=>5));
echo $_GET['callback'].'({"inputs":[{"analog0": "0"},{"analog1": "845"},{"analog2": "0"},{"analog3": "0"},{"analog4": "0"},{"analog5": "0"}]})'; //assign resulting code to $_GET['jsoncallback].
?>