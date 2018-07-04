angular.module('mostApp', [])

.controller('mainController', function($scope) {
	$scope.sortType     = 'birth'; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order
	$scope.searchPerson = '';     // set the default search/filter term
	$scope.maxYear = function() { // return the year the max population is identified
		var count	 = [];
		var pop		 = 0;
		var max 	 = 0;
		var year	 = 0;
		
		for(var i = 0; i < $scope.people.length; i++) {
			var person = $scope.people[i];
			var birth  = person.birth-1900;
			var death  = person.death-1900;
			if (!count[birth])
				count[birth] = 0;
			if (!count[death])
				count[death] = 0;
			count[birth] += 1;
			count[death] -= 1;
		}

		for(var i = 1; i <= 100; i++) {
			var temp = count[i];
			if (temp) {
				pop += temp;
				if(pop > max) {
					max = pop;
					year = i;
				}
			}
		}
		return year + 1900;
	};

	// create a list of persons
	$scope.people = [
		{ name: 'James Franco', birth: 1904, death: 1966 },
		{ name: 'Dave Simon', birth: 1933, death: 1992 },
		{ name: 'Tina Fey', birth: 1907, death: 1977 },
		{ name: 'Amy Poehler', birth: 1904, death: 1950 },
		{ name: 'Travis Smith', birth: 1925, death: 1992 },
		{ name: 'John Luke', birth: 1916, death: 1951 },
		{ name: 'Mike Marsh', birth: 1950, death: 1980 },
		{ name: 'Dan Patrick', birth: 1953, death: 1994 },
		{ name: 'Ang Lee', birth: 1927, death: 1989 },
		{ name: 'Quinto Monubo', birth: 1944, death: 1998 },
		{ name: 'Gave Turnero', birth: 1932, death: 1990 },
		{ name: 'Rahil Moghadam', birth: 1939, death: 1978 },
		{ name: 'Nancy Nguyen', birth: 1967, death: 1993 },
		{ name: 'Dean Chang', birth: 1982, death: 1999 },
		{ name: 'Chung Wang', birth: 1925, death: 1965 },
		{ name: 'Jane Teal', birth: 1949, death: 1999 },
		{ name: 'Ivana Moroff', birth: 1948, death: 1990 }
	];
});