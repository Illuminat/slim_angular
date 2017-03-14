angular.module('app',['ngRoute', 'ui.bootstrap']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/main', {
        controller: 'appController',
        templateUrl: 'public/tmp/main.html'
    }).
    when('/edit', {
        controller: 'appController',
        templateUrl: 'public/tmp/main.html'
    }).
    otherwise({
        redirectTo: '/main'
    });
}]).
controller('appController', function($scope, $uibModal){
    $scope.data = {};
    // function to get records from the database

    $scope.propertyName = 'created';
    $scope.reverse = true;

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.createTask = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modal',
            controller: 'createTask'
        });

        modalInstance.result.then(function () {
            $scope.getTasks();
        });

    };

    $scope.getTasks = function(){
        axios.get('api/tasks')
            .then(function (response) {
                $scope.data = response.data;
            })
            .catch(function (error) {
            });
    };
    $scope.updateTask = function(id){
        $scope.task = {};
        axios.get('api/task/'+id)
            .then(function (response) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal',
                    controller: 'updateTask',
                    resolve: {
                        data: function () {
                            return response.data;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $scope.getTasks();
                });
            })
            .catch(function (error) {
            });
    };
    $scope.deleteTask = function(id){
        axios.delete('api/task/'+id)
            .then(function (response) {
                console.log(response);
                $scope.data = response.data;
            })
            .catch(function (error) {
            });
        $scope.getTasks();
    };

    $scope.view = 'public/tmp/list.html';

}).
directive('appView', function() {
    return {
        scope: {
            view: '=appView'
        },
        replace: true,
        template: '<nav class="navbar navbar-default">' +
        '<div class="container">' +
        '<ul class="nav navbar-nav navbar-right">' +
        '<li ng-repeat="v in views" ng-bind="v.name" ng-class="v.icon" ng-click="switchView(v)"></li>' +
        '</ul>' +
        '</div>' +
        '</nav>',
        link: function(scope, el, attr) {
            scope.views = [{
                name: 'List',
                template: 'public/tmp/list.html',
                icon: 'btn btn-default navbar-btn glyphicon glyphicon-th-list'
            }, {
                name: 'Grid',
                template: 'public/tmp/grid.html',
                icon: 'btn btn-default navbar-btn glyphicon glyphicon-th'
            }];
        },
        controller: ['$scope', function($scope){
            $scope.switchView = function(view) {
                $scope.view = view.template;
            }
        }]
    }
});

angular.module('app').controller('createTask', function ($scope, $uibModalInstance) {

    $scope.ls = 'Create New Task';
    $scope.save = function () {
        axios.post('api/task/new', {
                title: $scope.title,
                type: $scope.type
            })
            .then(function (response) {
            })
            .catch(function (error) {
            });
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

angular.module('app').controller('updateTask', function ($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ls = 'Update Task #' + data.id;
    $scope.title = data.title;
    $scope.type  = data.type;

    $scope.save = function () {
        axios.put('api/task/' + data.id, {
            title: $scope.title,
            type: $scope.type
        })
            .then(function (response) {
            })
            .catch(function (error) {
            });
        $uibModalInstance.close();

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});