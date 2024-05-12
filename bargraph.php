<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8"/>
	<meta name="description"	  content="Data Visualisation"/>
	<meta name="keywords"		  content="HTML, CSS, D3"/>
	<meta name="author"			  content="Ashraf Toor & Layani Jayasinghe"/>

	<title>Final Project - Data Visualisation</title>
	
	<script src="bargraph.js"></script>   <!--Linking the javascript file -->
	<script src="https://d3js.org/d3.v7.min.js"></script>   <!-- Adding a D3 Library -->
	
</head>
<body>

	<h1>COS30045 - Data Visualisation</h1>
	<h2>Global Health Wallet: Tracking Expenditure Across Borders</h2>
	
	<h2>Bar Graph</h2>
	<form action="bargraph.php" method="get">
		<label for="country">Country:</label><br>
		<input type="checkbox" id="Australia" name="country[]" value="Australia">
		<label for="Australia">Australia</label><br>
		<input type="checkbox" id="Chile" name="country[]" value="Chile">
		<label for="Chile">Chile</label><br>
		<input type="checkbox" id="Denmark" name="country[]" value="Denmark">
		<label for="Denmark">Denmark</label><br>
		<input type="checkbox" id="Finland" name="country[]" value="Finland">
		<label for="Finland">Finland</label><br>
		<input type="checkbox" id="Germany" name="country[]" value="Germany">
		<label for="Germany">Germany</label><br>
		<input type="checkbox" id="UK" name="country[]" value="United Kingdom">
		<label for="UK">United Kingdom</label><br>
		<input type="checkbox" id="USA" name="country[]" value="United States">
		<label for="USA">United States</label><br>

		<label for="year">Year:</label><br>
		<input type="checkbox" id="2012" name="year[]" value="2012">
		<label for="2022">2012</label><br>
		<input type="checkbox" id="2013" name="year[]" value="2013">
		<label for="2022">2013</label><br>
		<input type="checkbox" id="2014" name="year[]" value="2014">
		<label for="2022">2014</label><br>
		<input type="checkbox" id="2015" name="year[]" value="2015">
		<label for="2022">2015</label><br>
		<input type="checkbox" id="2016" name="year[]" value="2016">
		<label for="2022">2016</label><br>
		<input type="checkbox" id="2017" name="year[]" value="2017">
		<label for="2022">2017</label><br>
		<input type="checkbox" id="2018" name="year[]" value="2018">
		<label for="2022">2018</label><br>
		<input type="checkbox" id="2019" name="year[]" value="2019">
		<label for="2022">2019</label><br>
		<input type="checkbox" id="2020" name="year[]" value="2020">
		<label for="2022">2020</label><br>
		<input type="checkbox" id="2021" name="year[]" value="2021">
		<label for="2023">2021</label><br>
		<input type="checkbox" id="2022" name="year[]" value="2022">
		<label for="2024">2022</label><br>

		<input type="submit" value="Submit">
	</form>

<?php
		if (isset($_GET['country']) || isset($_GET['year']))
		{
$barData = array(
    'country' => isset($_GET['country']) ? $_GET['country'] : array(),
    'year' => isset($_GET['year']) ? $_GET['year'] : array()
);

$filename = "../../data/finalproject/country_year.txt";
$dir = "../../data/finalproject";
if (!file_exists($dir)) {
    umask(0007);
    mkdir($dir, 02776, true); 
}

// Serialize the array to store in the file
$record = serialize($barData);

$handle = fopen($filename, "a"); // open the file in append mode
$data = $record . "\n";
if ($handle !== false) {
    fwrite($handle, $data); // write the data to the text file
    fclose($handle); // close the text file
    echo "<p>Job vacancy saved successfully!</p>";
    ?>
    <div class="links">
    <?php
    echo '<a href="postjobform.php">Post another job Vacancy</a>';
    ?>
    </div>
    <div class="rightside">
    <?php
    echo '<a href="index.php">Return to Home Page</a>';
    ?>
    </div>
    <?php
} else {
    echo "<p>Error: Unable to open the file for writing.</p>";
    ?>
    <div class="links">
    <?php
    echo '<a href="postjobform.php">Post another Job Vacancy</a>';
    ?>
    </div>
    <div class="rightside">
    <?php
    echo '<a href="index.php">Return to Home Page</a>';
    ?>
    </div>
    <?php
}

		}
		else 
		{
			echo "<p>Error: Invalid or missing input data. Please provide valid information.</p>";
			?>
			<div class = "links">
			<?php
			echo '<a href="postjobform.php">Post another Job Vacancy</a>';
			?>
			</div>
			<div class = "rightside">
			<?php
			echo '<a href="index.php">Return to Home Page</a>';
			?>
			</div>
			<?php
		}
?>
	<p id="chart"></p> 
	<br>
	<br>
	<footer style="color:grey">COS30045 Data Visualisation<br>Ashraf Toor - 104586656<br>Layani Jayasinghe - 104826310</footer>
</body>
</html>