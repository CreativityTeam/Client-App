angular.module('app.directives', [])

    .directive('myComments', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                subject: '='
            },
            controller: ['$scope', function ($scope) {
                $scope.limitSet = 5;
                $scope.parseCommentDate = function (date) {
                    date = new Date(date);
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var year = date.getFullYear();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    return day + "/" + month + "/" + year + " " + hour + ":" + minute;
                }
                $scope.increaseComment = function(){
                    $scope.limitSet += 5;
                }
            }],
            templateUrl: 'templates/directives-templates/my-comments.html'
        };
    });