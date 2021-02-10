class Table {
    constructor(
        selector,
        {
            data,
            column,
            search = true,
            sorting = true,
            pagination = true,
            orderBy = { defaultColumn: "name", det: "ASC" },
            ...otherOptions
        }
    ){

        this.selector = selector;
        this.data = data;
        this.column = column;
        this.sorting  = sorting;
        this.search = search;
        this.pagination = pagination;
        this.orderBy = orderBy;
        this.otherOptions = otherOptions;  //array of other options;
        this.renderTable();

    };

    renderTable() {
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        var tfoot = document.createElement('tfoot');

        table.setAttribute('class','table table-bordered table-striped table-dark table-hover');


        if(this.search){
            var t = this;
            var input = document.createElement('input');
            input.setAttribute('placeholder','Search');
            input.addEventListener('keyup',function( event ){
                var val = event.target.value.replace(/ /g, "").toLowerCase();
                t.removeAllChildNodes( tbody );

                return t.searchTable( val,tbody );
            });
            var div = document.createElement('div');
            div.setAttribute('class','headerSection');
            div.appendChild(input);
            this.selector.appendChild(div);
        }

        this.selector.appendChild(table);
        table.appendChild(thead);
        table.appendChild(tbody);
        table.appendChild(tfoot);

        this.renderThead( thead, tbody );
        this.renderTfoot(tfoot)






    };

    renderThead( thead, tbody ) {
        var sorting = this.sorting;
        var t = this;
        var column = this.column;
        var tr = document.createElement('tr');
        thead.appendChild(tr);

        for( var i of column ){
            var th = document.createElement('th');
            var title = document.createTextNode(i.title);
            th.appendChild(title);
            tr.appendChild(th);

            if( i.title === this.orderBy.defaultColumn){
                t.sortTable( tbody, tr.childNodes[ column.indexOf(i) ].textContent, this.orderBy.det );
                th.setAttribute('class',this.orderBy.det);
            }

            if(sorting){
                th.addEventListener('click',function( event ) {
                    var currentTh = event.target.childNodes[0].data;

                    if( event.target.getAttribute('class') === "ASC" ){
                        event.target.setAttribute('class',"DESC");
                        t.orderBy.det = "DESC";
                    }
                    else if( event.target.getAttribute('class') === "DESC" ){
                        event.target.setAttribute('class',"ASC");
                        t.orderBy.det = "ASC";
                    }
                    if(!event.target.getAttribute('class')){
                        for( var child of tr.childNodes ){
                            child.removeAttribute('class');
                        }
                        event.target.setAttribute('class',"ASC");
                        t.orderBy.det = "ASC";
                    }

                    return t.sortTable( tbody, currentTh, t.orderBy.det );
                });


                th.setAttribute('style','cursor:pointer');
            }

        }

    };

    renderTbody( tbody, data ) {
        var column = this.column;
console.log(data)
        if( data.length !== 0 ){
            for( var j of data ){
                var tr = document.createElement('tr');
                tbody.appendChild(tr);
                for( var k of column ){
                    var td = document.createElement('td');
                    var info = document.createTextNode(j[k.title]);
                    td.appendChild(info);
                    tr.appendChild(td);
                }
            }
        }
        else{
            var tr__notFound = document.createElement('tr');
            var td__notFound = document.createElement('td');
            var info__notFound = document.createTextNode("Note Found");
            td__notFound.appendChild(info__notFound);
            td__notFound.setAttribute('colspan',column.length);
            tr__notFound.appendChild(td__notFound);
            tbody.appendChild(tr__notFound);
        }

    };

    renderTfoot( tfoot ) {
        var column = this.column;
        var tr = document.createElement('tr');
        tfoot.appendChild(tr);

        for( var i of column ){
            var th = document.createElement('th');
            var title = document.createTextNode(i.title);
            th.appendChild(title);
            tr.appendChild(th);
        }
    };

    searchTable( val,tbody ) {
        var data = this.data;
        var column = this.column;
        var filteredData = [ ];

        for( var dataItem of data ){
            for( var columnItem of column ){
                var dataField = dataItem[columnItem.title].replace(/ /g, "").toLowerCase();

                if( dataField.indexOf(val) !== -1 ){
                    filteredData.push(dataItem);
                    break;
                }
            }
        }

        this.renderTbody( tbody, filteredData );

    };

    removeAllChildNodes( parent ) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    };

    sortTable( tbody, sortableColumn, orderBy ){
        console.log(sortableColumn)
        const data = this.data;
        const sortedData = data.sort( ( a, b ) => {
            if( orderBy === "ASC" ){
                if( a[sortableColumn].toLowerCase() < b[sortableColumn].toLowerCase() ){
                    return -1;
                }
                if( a[sortableColumn].toLowerCase() > b[sortableColumn].toLowerCase() ){
                    return 1;
                }
                return 0;
            }
            else if( orderBy === "DESC" ){
                if( a[sortableColumn].toLowerCase() > b[sortableColumn].toLowerCase() ){
                    return -1;
                }
                if( a[sortableColumn].toLowerCase() < b[sortableColumn].toLowerCase() ){
                    return 1;
                }
                return 0;
            }


        })
        this.removeAllChildNodes( tbody )
        this.renderTbody( tbody, sortedData )
    };




}












document.addEventListener('DOMContentLoaded', function() {
     var dataSet = [
        [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
        [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
        [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
        [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
        [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
        [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
        [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
        [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
        [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
        [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ],
        [ "Quinn Flynn", "Support Lead", "Edinburgh", "9497", "2013/03/03", "$342,000" ],
        [ "Charde Marshall", "Regional Director", "San Francisco", "6741", "2008/10/16", "$470,600" ],
        [ "Haley Kennedy", "Senior Marketing Designer", "London", "3597", "2012/12/18", "$313,500" ],
        [ "Tatyana Fitzpatrick", "Regional Director", "London", "1965", "2010/03/17", "$385,750" ],
        [ "Michael Silva", "Marketing Designer", "London", "1581", "2012/11/27", "$198,500" ],
        [ "Paul Byrd", "Chief Financial Officer (CFO)", "New York", "3059", "2010/06/09", "$725,000" ],
        [ "Gloria Little", "Systems Administrator", "New York", "1721", "2009/04/10", "$237,500" ],
        [ "Bradley Greer", "Software Engineer", "London", "2558", "2012/10/13", "$132,000" ],
        [ "Dai Rios", "Personnel Lead", "Edinburgh", "2290", "2012/09/26", "$217,500" ],
        [ "Jenette Caldwell", "Development Lead", "New York", "1937", "2011/09/03", "$345,000" ],
        [ "Yuri Berry", "Chief Marketing Officer (CMO)", "New York", "6154", "2009/06/25", "$675,000" ],
        [ "Caesar Vance", "Pre-Sales Support", "New York", "8330", "2011/12/12", "$106,450" ],
        [ "Doris Wilder", "Sales Assistant", "Sydney", "3023", "2010/09/20", "$85,600" ],
        [ "Angelica Ramos", "Chief Executive Officer (CEO)", "London", "5797", "2009/10/09", "$1,200,000" ],
        [ "Gavin Joyce", "Developer", "Edinburgh", "8822", "2010/12/22", "$92,575" ],
        [ "Jennifer Chang", "Regional Director", "Singapore", "9239", "2010/11/14", "$357,650" ],
        [ "Brenden Wagner", "Software Engineer", "San Francisco", "1314", "2011/06/07", "$206,850" ],
        [ "Fiona Green", "Chief Operating Officer (COO)", "San Francisco", "2947", "2010/03/11", "$850,000" ],
        [ "Shou Itou", "Regional Marketing", "Tokyo", "8899", "2011/08/14", "$163,000" ],
        [ "Michelle House", "Integration Specialist", "Sydney", "2769", "2011/06/02", "$95,400" ],
        [ "Suki Burks", "Developer", "London", "6832", "2009/10/22", "$114,500" ],
        [ "Prescott Bartlett", "Technical Author", "London", "3606", "2011/05/07", "$145,000" ],
        [ "Gavin Cortez", "Team Leader", "San Francisco", "2860", "2008/10/26", "$235,500" ],
        [ "Martena Mccray", "Post-Sales support", "Edinburgh", "8240", "2011/03/09", "$324,050" ],
        [ "Unity Butler", "Marketing Designer", "San Francisco", "5384", "2009/12/09", "$85,675" ]
    ];


    var dataSetWithObjs = dataSet.map(function(x) {
        return {
            name: x[0],
            position: x[1],
            office: x[2],
            ext: x[3],
            startDate: x[4],
            salary: x[5]
        };
    });

    document.querySelector('#app').DataTable({
        data: dataSetWithObjs,
        column: [
            { title: "name" },
            { title: "position" },
            { title: "office" },
            { title: "startDate" },
            { title: "salary" },
        ],


    });


});



Object.prototype.DataTable = function(args) {
    const selector = this;
    const dataTable = new Table( selector, args );
};
