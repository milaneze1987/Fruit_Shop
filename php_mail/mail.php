<?php
$data = file_get_contents('php://input');
$data = json_decode($data, true);
// var_dump($data);
// повідомлення
 $message  = 'Name: '.$data['name']."\n";
 $message .= 'Phone: '.$data['phone']."\n";
 $message .='>>>>>>>>>>>>>'."\n";
 foreach ($data['cart'] as $key => $value) {
    $message .='id: '.$key."\n";
    $message .=' count: '.$value."\n";
    $message .='------------------'."\n";
 }
// відправляєм
 $mail = mail($data['email'], 'GoogleShop', $message);
if ($mail){
    echo 'yes';
}
else {
    echo 'no';
}


?>