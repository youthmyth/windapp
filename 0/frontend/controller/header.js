define([
  'app'
],function(app){
app.controller('HeaderController', 
    [       '$scope', '$location', '$state',
    function($scope,   $location,   $state) {
    $scope.menu = [{
        "title": "Products",
        "state": "products.list"
    },{
        'title': 'Client & Supplier',
        'state': 'company.list'
    }];
    $scope.isSelected = function(item) {
        if ($state.is(item.state)) {
            return "active"
        } else return ""
    };
}]);
});
