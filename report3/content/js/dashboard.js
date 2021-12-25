/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9935714285714285, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Click on the [HOME] button"], "isController": false}, {"data": [0.995, 500, 1500, "Go to the groups list"], "isController": false}, {"data": [0.97, 500, 1500, "Click on the [ENTER] button"], "isController": false}, {"data": [1.0, 500, 1500, "Add contact to the group"], "isController": false}, {"data": [1.0, 500, 1500, "Home page"], "isController": false}, {"data": [1.0, 500, 1500, "EDIT"], "isController": false}, {"data": [0.98, 500, 1500, "choose the group and click on the button [Delete groups]"], "isController": false}, {"data": [1.0, 500, 1500, "Go to the group page"], "isController": false}, {"data": [0.995, 500, 1500, "Authorization"], "isController": false}, {"data": [1.0, 500, 1500, "Click on the [NEXT] button"], "isController": false}, {"data": [0.985, 500, 1500, "Choose the contacts and click on the button [Delete]"], "isController": false}, {"data": [1.0, 500, 1500, "logout"], "isController": false}, {"data": [1.0, 500, 1500, "Click on the [ADD GROUPS] button"], "isController": false}, {"data": [0.955, 500, 1500, "[Update]"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Go to the contact list"], "isController": false}, {"data": [0.985, 500, 1500, "Click on the [Enter information] button"], "isController": false}, {"data": [1.0, 500, 1500, "Go to the home page"], "isController": false}, {"data": [1.0, 500, 1500, "Click on the [ADD NEW CONTACT] button"], "isController": false}, {"data": [1.0, 500, 1500, "Click on the [GROUPS] button"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 0, 0.0, 54.238095238095276, 0, 1267, 26.0, 105.0, 169.94999999999982, 607.5099999999893, 8.509052010567432, 97.31440010170344, 6.600553632858717], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Click on the [HOME] button", 100, 0, 0.0, 26.460000000000004, 15, 97, 27.0, 28.0, 29.94999999999999, 96.34999999999967, 0.4429423776260946, 9.961324209458592, 0.07747165999300151], "isController": false}, {"data": ["Go to the groups list", 100, 0, 0.0, 27.46000000000001, 10, 558, 23.0, 25.0, 26.0, 552.8099999999973, 0.4432840253735776, 3.2133676315112885, 0.08142746598903315], "isController": false}, {"data": ["Click on the [ENTER] button", 100, 0, 0.0, 143.55999999999995, 51, 1028, 93.0, 291.5, 540.8999999999997, 1026.6699999999994, 0.4424857077116409, 2.2863677274708403, 1.913508701481442], "isController": false}, {"data": ["Add contact to the group", 100, 0, 0.0, 25.569999999999997, 11, 343, 24.0, 26.0, 27.94999999999999, 339.8699999999984, 0.442940415655286, 2.740261262867419, 0.444558186314027], "isController": false}, {"data": ["Home page", 200, 0, 0.0, 27.769999999999992, 14, 241, 27.0, 29.0, 29.0, 159.71000000000117, 0.854200745717251, 19.094089411327555, 0.14940171245894499], "isController": false}, {"data": ["EDIT", 100, 0, 0.0, 31.47000000000001, 17, 245, 30.0, 33.0, 34.0, 243.09999999999903, 0.4429482636428065, 7.598898581458186, 0.08915198939138909], "isController": false}, {"data": ["choose the group and click on the button [Delete groups]", 100, 0, 0.0, 122.38, 42, 871, 77.5, 243.2000000000001, 356.0, 869.5099999999993, 0.44318776092679424, 2.609787303113837, 0.2972820402591762], "isController": false}, {"data": ["Go to the group page", 100, 0, 0.0, 21.47, 11, 26, 23.0, 25.0, 25.0, 26.0, 0.44294630161985465, 3.209851035774558, 0.08136542903778775], "isController": false}, {"data": ["Authorization", 100, 0, 0.0, 35.320000000000014, 15, 514, 27.0, 30.0, 43.94999999999999, 512.6199999999993, 0.4424915815976601, 9.61519082587735, 0.28482802841238447], "isController": false}, {"data": ["Click on the [NEXT] button", 100, 0, 0.0, 24.88, 13, 37, 25.0, 28.0, 28.94999999999999, 36.969999999999985, 0.44255228755277437, 6.747344928295466, 0.29157453742222145], "isController": false}, {"data": ["Choose the contacts and click on the button [Delete]", 100, 0, 0.0, 125.35, 23, 1231, 83.0, 201.40000000000003, 318.0999999999989, 1225.299999999997, 0.4431209897550427, 2.607148213169999, 0.08572487116257223], "isController": false}, {"data": ["logout", 100, 0, 0.0, 19.51, 8, 24, 21.0, 23.0, 23.0, 24.0, 0.4433705025604647, 2.4281462679287946, 0.2176195784100734], "isController": false}, {"data": ["Click on the [ADD GROUPS] button", 100, 0, 0.0, 21.68, 10, 29, 23.0, 25.0, 26.0, 28.989999999999995, 0.44285606734955074, 3.0034507137179096, 0.22004843323059073], "isController": false}, {"data": ["[Update]", 100, 0, 0.0, 225.25000000000009, 24, 1267, 138.5, 404.00000000000006, 867.0999999999996, 1265.309999999999, 0.4428188074003879, 2.1338850209896116, 2.1220534559793824], "isController": false}, {"data": ["Debug Sampler", 100, 0, 0.0, 0.09999999999999998, 0, 1, 0.0, 0.9000000000000057, 1.0, 1.0, 0.4428894105141946, 0.13964856725275698, 0.0], "isController": false}, {"data": ["Go to the contact list", 100, 0, 0.0, 26.97, 14, 102, 27.0, 28.0, 29.94999999999999, 101.28999999999964, 0.44329974598924554, 9.702588988268072, 0.07753416455729871], "isController": false}, {"data": ["Click on the [Enter information] button", 100, 0, 0.0, 127.97000000000006, 44, 1251, 88.0, 190.70000000000002, 343.44999999999897, 1248.929999999999, 0.44278939607954265, 2.7579293202961375, 0.5338206691876143], "isController": false}, {"data": ["Go to the home page", 100, 0, 0.0, 26.069999999999997, 14, 58, 27.0, 28.0, 29.0, 57.72999999999986, 0.4431818685433942, 9.920336154832233, 0.07751354751574403], "isController": false}, {"data": ["Click on the [ADD NEW CONTACT] button", 100, 0, 0.0, 25.980000000000004, 11, 339, 23.0, 25.0, 26.0, 335.8799999999984, 0.4425816673821737, 2.729402007163184, 0.08086624020234834], "isController": false}, {"data": ["Click on the [GROUPS] button", 100, 0, 0.0, 26.01, 10, 169, 24.0, 26.0, 26.0, 168.6499999999998, 0.44284430037243205, 3.170786813923468, 0.08134669228520945], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
