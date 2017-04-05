app.controller('mainController', function($scope) {
    $scope.nbPeople = 0;

    $scope.increment = function() {
        $scope.nbPeople++;
    };

    $scope.decrement = function() {
        if ($scope.nbPeople > 0) {
            $scope.nbPeople--;
        }
    };
});