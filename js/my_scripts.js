$(document).ready(function(){
	var FREQ = 1000 ;
	var repeat = true;

	$("#dataTable").dataTable(
		{ "bJQueryUI": true

	});

	$("#refresh").button({icons :{primary: "ui-icon-refresh"}});
	$("#potentiometerSlider").slider({range: "min", animate : true, min: 0,  max: 1000}); 
	$("#photoresistorSlider").slider({range: "min", animate : true, min: 0,  max: 1000}); 
	$("#pingSlider").slider({range: "min", animate : true, min: 0, max: 80});	
	//$("#head").effect("size", {to: { width: 566, height: 602 }});
	$("#head").hide();
	$('#btnPause').button();
	
	$("#buttonGroup").buttonset();
	$("#buttonGroup.input").button("option","disabled",true);

	function showFrequency(){
		$("#freq").html( "Page refreshes every " + FREQ/1000 + " second(s).");
	}
	
	function startAJAXcalls(){
	
		if(repeat){
			setTimeout( function() {
					getInputs();
					startAJAXcalls();
				}, 	
				FREQ
			);
		}
	}
	function showFrequency(){
		$("#freq").html( "Page refreshes every " + FREQ/1000 + " second(s).");
	}
	function getInputs(){
		$.ajax({
			url: "http://j.lukedubber.com:8080",
			async: true,
			dataType: 'jsonp',
			jsonpCallback : "handleJSON",
			success: function(data)
			{
				if (data.inputs.length > 0) {

					$.each(data.inputs, function(){
						$("#potentiometerSlider").slider({value: this['analog1']});						
						$("#photoresistorSlider").slider({value: this['analog0']});
				//		$("#head1").html("X:"+((this['analog0']/1000)*566) + "Y:" + ((this['analog0']/1000)*602));						
				//		$("#head").effect("size", {to: { width: ((this['analog0']/1000)*566), height: ((this['analog0']/1000)*602) }});
						//$("#head").effect("scale", {percent: (this['analog1']/10)+"%"});
						var tableData = [];
						$.each(this, function(index,value){
							tableData.push(value);
						});
						for(i=0; i < this.length; i++)
							alert(this[i]);
						var text = "";

						$("#dataTable").dataTable().fnAddData(tableData);

						potentiometerChartTimeSeries.append(new Date().getTime(), this['analog0']);
						photoresistorChartTimeSeries.append(new Date().getTime(), this['analog1']);
						pingChartTimeSeries.append(new Date().getTime(), ((this['digital6'] / 74) / 2));/// 74 / 2));								
						
						$("#pingSlider").slider({value: (this['digital6']/ 74 / 2)});
						
						if(this['green'] == 1) 
							$("#greenBtn").prop("checked", true).change(); 
						else 
							$("#greenBtn").prop("checked", false).change();
						
						if(this['red'] == 1) 
							$("#redBtn").prop("checked", true).change(); 
						else 
							$("#redBtn").prop("checked", false).change();
												
						if(this['yellow'] == 1) 
							$("#yellowBtn").prop("checked", true).change(); 
						else 
							$("#yellowBtn").prop("checked", false).change();
						
					});
					
				}
				
			},
			error: function(data)
			{
				//$("#errorlog").append("Error: respones slow,");

			},
			parsererror: function(data)
			{
				alert("error:"+data);
			}
			
		});
	}	
	function getTimeAjax(){
		var time = "";
		$.ajax({
			url: "time.php",
			cache: false,
			success: function(data){
				$('#updatedTime').html(data);
			}
		});
	}
	
	
	$("#btnPause").button({icons: {primary: "ui-icon-play"}}).click(function(){
		if(repeat) {
			repeat = false;
			$("#btnPause").button({label: "Resume", icons: {primary: "ui-icon-play"}});
	 	}else{
			$("#btnPause").button({label: "Pause", icons: {primary: "ui-icon-pause"}});
			repeat = true;
            startAJAXcalls();

		}
	});	
    var potentiometerChartTimeSeries = new TimeSeries();
    var photoresistorChartTimeSeries = new TimeSeries();
    var pingChartTimeSeries = new TimeSeries();
    
    function createTimeline() {
      var photoresistorChart = new SmoothieChart();
      var potentiometerChart = new SmoothieChart();
      var pingChart = new SmoothieChart();      
      photoresistorChart.addTimeSeries(potentiometerChartTimeSeries , { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
      potentiometerChart.addTimeSeries(potentiometerChartTimeSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
      potentiometerChart.addTimeSeries(photoresistorChartTimeSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
      potentiometerChart.addTimeSeries(pingChartTimeSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });  
      
      pingChart.addTimeSeries(pingChartTimeSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
      

      
      photoresistorChart.streamTo(document.getElementById("photoresistorChart"), FREQ);
      potentiometerChart.streamTo(document.getElementById("potentiometerChart"), FREQ);     
      pingChart.streamTo(document.getElementById("pingChart"), FREQ);       
    }	
	showFrequency();	
	getInputs();
	createTimeline()	
	startAJAXcalls();
	
	
	
    // Randomly add a data point every 500ms

	
	
});

