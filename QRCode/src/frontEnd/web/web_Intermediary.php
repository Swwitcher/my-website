<?php
  if (isset($_GET[plugin])) {
    $shell = exec("python3 ../../backEnd/OrchestratorFunction.py $_GET[plugin] qrcodes/ 2>&1");
    //var_dump($shell);
  }
 ?>
