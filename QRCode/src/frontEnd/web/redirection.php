<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <meta charset="utf-8">
  <title></title>
</head>

<body>

  <?php
    if (isset($_GET[plugin])) {
      echo "<div class='qrCodeDynRedirection' pluginName='$_GET[plugin]'></div>";
    } else {
      echo "Ce lien est invalide ou n'est plus disponible.";
    }
   ?>

</body>

<script defer src="WebClientDisplay.js"></script>

</html>
