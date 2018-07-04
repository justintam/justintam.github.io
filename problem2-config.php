<?php
	class Database {
		private $conn;

		// connectDB function connects to local mysql as root
		function connectDB() {
			// connection's parameters
			$host     = 'localhost';
			$database = 'empire_slots';
			$username = 'admin';
			$password = 'password';
			$this->conn     = new mysqli($host, $username, $password, $database);
			if (mysqli_connect_errno()) {
				exit('Connect failed: '. mysqli_connect_error());
			}
		}
		
		// checkName function to verify that a username is not already registered
		function checkName($name) {
			$safe_name  = mysqli_real_escape_string($this->conn, $name);
			$sql    	= "SELECT id FROM players WHERE name = '".$safe_name."'";
			$result 	= $this->conn->query($sql) or die(mysqli_error($this->conn));
			return $result;
		}
		
		// checkEmail function to verify that a username is not already registered
		function checkEmail($email) {
			// check that email is not already in list
			$safe_email = mysqli_real_escape_string($this->conn, $email);
			$sql      	= "SELECT id FROM players WHERE email = '".$safe_email."'";
			$result 	= $this->conn->query($sql) or die(mysqli_error($this->conn));
			return $result;
		}

		// initDB function to check if table exists and initialize it
		function initDB() {
			// sql query to create table for players
			$sql = "CREATE TABLE IF NOT EXISTS players (
						id INT AUTO_INCREMENT PRIMARY KEY,
						name VARCHAR(10) NOT NULL,
						email VARCHAR(50) NOT NULL,
						credits INT(10) NOT NULL,
						spins INT(10) NOT NULL,
						salt VARCHAR(50) NOT NULL
					)";

			if ($this->conn->query($sql) === true) {
				/* DEBUG if table created, add random players for this problem's testing */
				$this->createPlayer("TestUser1", "jl87@yahoo.com");
				$this->createPlayer("TestUser2", "elliot.spitzer@msn.com");
				$this->createPlayer("melindaB", "melinda.belinda@gmail.com");
			} else {
                echo "Error: " . $this->conn->error;
			}
		}
		
		// createPlayer function to create and insert a player into the DB
		function createPlayer($name, $email) {
			// verify that the username and email aren't already present
			if (($this->checkName($name)->num_rows < 1) && ($this->checkEmail($email)->num_rows < 1)) {
				// then create random salt value
				$salt = $this->getSalt();
				
				// both credits and spins could be changed or made into a parameter if desired
				$credits = 2500;
				$spins = 0;

				// sql query to insert data into table.
				$sql = "INSERT INTO players (name, email, credits, spins, salt)
						VALUES ('" . $name . "', '" . $email . "', '" . $credits . "', '" . $spins . "', '" . $salt . "')";
				
				if ($this->conn->query($sql) === true) {
					// DEBUG echo "Player created successfully!";
				} else {
					// DEBUG echo "Oh no! Player creation failed!";
				}
			} else {
			    // DEBUG echo "Player already exists!";
			}
		}

		// playSpin function updates player with win and bet information
		function validateSpin($hash, $won, $bet, $id) {

			// sql query to select current player
			$sql = 'SELECT * FROM players WHERE ID = ' . $id;
			
			$result = $this->conn->query($sql);

			if ($result->num_rows > 0) { // if player found, then do this
				while ($player = $result->fetch_assoc()) {
					
					$salt = $player['salt'];

					// validate hash param against player salt
					if ($hash === $salt) {
						$credits = $player['credits'];
						
						// calculate credits won or lost
						if ($won < 0) {
							$credits -= $bet;
						} else {
							$credits += $won;
						}

						// increment total spins
						$spins = $player['spins'] + 1;

						// sql query to update player with updated values
						$sql = "UPDATE players
								SET credits = " . $credits . ", spins = " . $spins . "
								WHERE ID = " . $id;

						// if player successfully updated, return json
						if ($this->conn->query($sql) === true) {
							// average return =  credits / spins
							$average = $credits / $spins;

							// create array for json encode
							$array = array('id' => $id, 'name' => $player['name'], 
							'credits' => $credits, 'spins' => $spins,
							'average' => $average);
					    
					    	echo json_encode($array);
						}
					} else {
						echo("Oh no! Hash mismatch!");
					}
				}
			}
		}
		
		// getSalt function build and returns a random salt to add to the password
		function getSalt() {
			$charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			$saltLength = 16; // could be any length

			$salt = "";
			for ($i = 0; $i < $saltLength; $i++) {
				$salt .= $charset[mt_rand(0, strlen($charset) - 1)];
			}

			return $salt;
		}
	}
?>