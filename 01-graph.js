queue()
    .defer(d3.json, "data/transactions.json")
    .await(makeCharts);

function makeCharts(error, transactionsData) {

    let ndx = crossfilter(transactionsData);

    let parseDate = d3.time.format("%d/%m/%Y").parse;

    transactionsData.forEach(function(d, i) {
        d.date = parseDate(d.date);
    });

    let dateDim = ndx.dimension(dc.pluck("date"));
    let totalSpendByDate = dateDim.group().reduceSum(dc.pluck("date"));

    let minDate = dateDim.bottom(1)[0].date;
    let maxDate = dateDim.top(1)[0].date;

    tomSpend = dateDim.group().reduceSum(
        function(d, i) {
            if (d.name === "Tom") {
                return +d.spend; // "+" makes sure a number is returnedn as opposed to a string
            }
            else {
                return 0;
            }
        });
    aliceSpend = dateDim.group().reduceSum(
        function(d, i) {
            if (d.name === "Alice") {
                return +d.spend; // "+" makes sure a number is returnedn as opposed to a string
            }
            else {
                return 0;
            }
        });
    bobSpend = dateDim.group().reduceSum(
        function(d, i) {
            if (d.name === "Bob") {
                return +d.spend; // "+" makes sure a number is returnedn as opposed to a string
            }
            else {
                return 0;
            }
        });

    let compositeChart = dc.compositeChart("#composite-chart")

    compositeChart
        .width(1000)
        .height(200)
        .dimension(dateDim)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .yAxisLabel("Spend")
        .xAxisLabel("Months")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(compositeChart)
            .colors("green")
            .group(tomSpend, "Tom"),
            dc.lineChart(compositeChart)
            .colors("red")
            .group(aliceSpend, "Alice"),
            dc.lineChart(compositeChart)
            .colors("blue")
            .group(bobSpend, "Bob")
        ])
        .render()
        .yAxis().ticks(4);

    let nameDim = ndx.dimension(dc.pluck("name"));
    let totalSpendByPerson = nameDim.group().reduceSum(dc.pluck("spend"));
    let spendChartByPerson = dc.barChart("#spend-per-person-chart");

    spendChartByPerson
        .width(300)
        .height(300)
        .dimension(nameDim)
        .group(totalSpendByPerson)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Person")
        .yAxisLabel("Total Spend")
        .yAxis().ticks(4);


    let pieDim = ndx.dimension(function(d, i) {
        if (d.spend >= 200) {
            return "Big";
        }
        else if (d.spend > 100) {
            return "Medium"
        }
        else {
            return "Small"
        }
    });

    let pieGroup = pieDim.group();

    dc.pieChart("#spend-type-chart")
        .height(300)
        .radius(100)
        .dimension(pieDim)
        .group(pieGroup);
    
    // custom reduce functions
    let spendGroup = nameDim.group().reduceSum(dc.pluck("spend"));
    let spendChart = dc.barChart("#spend-chart");
    
    spendChart
        .width(500)
        .height(300)
        .dimension(nameDim)
        .group(spendGroup)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Person")
        .yAxisLabel("Avg. Spend");
    


    dc.renderAll();

} //makeCharts
