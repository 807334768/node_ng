import {baseData} from '../config/data';

chart.$inject = ['$scope', '$http', '$rootScope'];
export default function chart($scope,$http,$rootScope){
    $scope.formView={
        cla:"form-inline",
        name:'formName',
        sonC:[

            {
                title: "开始日期",
                type:"timepicker",
                name:'startTime',
                value:''
            },{
                title:'结束日期',
                type:'timepicker',
                name:'endTime',
                value:''
            }
        ]
    }
    var vm = this;
    $scope.realTime=true;
    $scope.tableV={"head":[],"body":[]};
    function activeLastPointToolip(chart) {
        var points = chart.series[0].points;
        chart.tooltip.refresh(points[points.length -1]);
    }

    var ws = new WebSocket('ws://localhost:8089/ws');
    ws.onerror=function(err){ console.log('_error'); };
    ws.onopen=function(){
        function sendNumber() {
            if (ws.readyState === ws.OPEN) {
                ws.send(new Date());
                setTimeout(sendNumber, 60000);
            }
        }
        sendNumber();
    };

    ws.onmessage=function(msg){
        let result=(msg.data).split("/");
        $scope.xData=result[0].split(",").reverse();
        $scope.yData=[];

        for(let v of result[1].split(",")){
            $scope.yData.push( Number(v))
        }
        $scope.$apply(
            vm.realline = {
                series: [
                    {
                        text: '实时交易量',
                        data:$scope.yData||[1,2,3,4,5,6,7,8,9,10]
                    }
                ],
                options: {
                    chart: {
                        type: 'spline',
                    },

                    tooltip: {
                        xDateFormat: '%H:%M',
                        valueDecimals: 2
                    },
                    xAxis: {
                        categories:$scope.xData||realTime
                    },
                    yAxis: [{
                        title: {
                            text: "交易量（笔）"
                        },
                        showFirstLabel: true
                    }],


                    title: {
                        text: '实时交易量'
                    },
                    credits:{
                        enabled:false
                    }


                },function(c) {
                    activeLastPointToolip(c)
                }
            }
        )

    }



    ws.onclose=function(){ console.log('_close')};


   /* $http.post(baseData.baseUrl+"/chartInfo").success( function(response) {});*/

    /*excel*/
    $scope.lineExcel=function (){
        $.ajax({
            type:'post',
            async:true,
            cache: false,
            url:baseData.baseUrl+"/createExcel",
            data:{
                startTime: $scope.start,
                endTime: $scope.end,
                head: $scope.tableV.head,
                body:$scope.tableV.body
            },
            dataType:'json',
            success:function(result){
           // alert(baseData.downFileUrl+result)
                window.location=baseData.downFileUrl+result;
            },
            error:function(err){console.log("error")}
        })
    }

    $scope.submitFun=function (){
        $scope.commonAjax(baseData.baseUrl+"/chartInfo",$scope.formView.sonC,$scope.operationListResult);
    }
    $scope.commonAjax=function (url,data,fn){
        $.ajax({
            url:url,
            data:data,
            type:'post',
            dataType:'json',
            async: false,
            success:function(result){
                fn(result);
            },
            error:function (){
            }
        })
    }
    /*结果处理*/
    $scope.operationListResult=function (response){
        $scope.start=response.start;
        $scope.end=response.end;
        $scope.time=response.time;
        $scope.sumNumSd=response.sumNumSd;
        $scope.sumNumHl=response.sumNumHl;
        $scope.sdNum=response.sdNum;
        $scope.sdMoney=response.sdMoney;
        $scope.hlNum=response.hlNum;
        $scope.hlMoney=response.hlMoney;
        $scope.sumMoney=response.sumMoney;
        $scope.sunNum=response.sumNum;
        $scope.yNum=response.sdNum;
        vm.line = {
            options: {
                chart: {
                    type: 'spline'
                },
                tooltip: {
                    xDateFormat: '%Y-%m-%d %H:%M:%S',
                    valueDecimals: 2
                },
                xAxis: {
                    categories:$scope.time,
                    tickInterval: 1
                },
                yAxis: [{ // 第一个 Y 轴，放置在左边（默认在坐标）
                    title: {
                        text: "交易量（笔）"
                    },

                    showFirstLabel: true
                }, {    // 第二个坐标轴，放置在右边
                    linkedTo: 0,
                    gridLineWidth: 0,
                    opposite: true,  // 通过此参数设置坐标轴显示在对立面
                    title: {
                        text: '交易金额（元）'
                    },
                    showFirstLabel: true
                }],

                series: [
                    {
                        name: '收单交易量',
                        data:  $scope.sdNum
                    },{
                        name:'收单金额',
                        yAxis: 0,
                        data:$scope.sdMoney
                    },
                    {
                        name: '互联网交易量',
                        data: $scope.hlNum
                    },

                    {
                        name:'互联网金额',
                        yAxis: 0,
                        data: $scope.hlMoney
                    }
                ],
                title: {
                    text: '交易量'
                },
                credits:{
                    enabled:false
                }

            }
        }


        console.log($scope.sumNumHl)
        vm.pie={
            options:{
                chart:{
                    type:'pie'
                },
                title:{
                    text:'交易笔数占比'
                },
                tooltip: {
                    headerFormat: '{series.name}<br>',
                    pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                },
                credits:{
                    enabled:false
                }
            },
            series:[{
                name:'交易笔数占比',
                data:[
                    ["收单笔数",$scope.sumNumSd],
                    ["互联网笔数",$scope.sumNumHl]
                ]
            }]
        }
        console.log(response.tabeData[0])
        console.log(response.body)
        $scope.tableV.head=response.tabeData[0];
        $scope.tableV.body=response.body

    }
    $scope.commonAjax(baseData.baseUrl+"/chartInfo",$scope.formView.sonC,$scope.operationListResult);



}
