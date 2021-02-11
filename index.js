class Table {
    constructor(
        selector,
        {
            data,
            column,
            search = true,
            sorting = true,
            pagination = {
                bool: true,
                rows: 10,
            },
            orderBy = {
                defaultColumnIndex: 0,
                columnIndex: 0,
                det: "ASC",
            },
            ...otherOptions
        }
    ) {

        this.selector = selector;
        this.allData = data;
        this.data = this.allData.slice(0,this.allData.length);
        this.column = column;
        this.sorting = sorting;
        this.search = search;
        this.pagination = pagination;
        this.orderBy = orderBy;
        this.otherOptions = otherOptions;  //array of other options;
        this.renderTable ();


    };

    renderTable() {
        var table = this.crtNodeElement ( 'table', '', {
            name: 'class',
            value: 'table table-bordered table-striped table-dark table-hover'
        } );


        // table.appendChild ( tfoot );

        if (this.search) {
            var t = this;
            var input = this.crtNodeElement ( 'input', '', {name: 'placeholder', value: 'Search'} );
            var div = this.crtNodeElement ( 'div', '', {name: 'class', value: 'headerSection'} );
            div.appendChild ( input );
            this.selector.appendChild ( div );


            input.addEventListener ( 'keyup', function (event) {
                var val = event.target.value.replace ( / /g, "" ).toLowerCase ();
                var filteredData = t.searchTable ( val );
                t.data = t.sortTable ( t.orderBy.columnIndex, t.orderBy.det, filteredData );
                if(t.pagination.bool){
                    var divPagination = t.createPagination( t.data );
                    var tableIndex = t.findChildNodeIndex ( table );
                    t.selector.removeChild( t.selector.childNodes[tableIndex+1] )
                    table.insertAdjacentElement('afterend', divPagination );
                }


                var tbody = t.renderTbody();
                table.removeChild(table.childNodes[1]);
                thead.insertAdjacentElement('afterend', tbody );
                table.removeChild(table.childNodes[2]);
                var tfoot = t.renderTfoot();
                tbody.insertAdjacentElement('afterend', tfoot );
            } );


        }





        this.selector.appendChild ( table );
        this.data = this.sortTable ( this.orderBy.defaultColumnIndex, this.orderBy.det, this.data );
        var thead = this.renderThead();
        if(this.pagination.bool){
            var divPagination = this.createPagination();
            this.selector.appendChild( divPagination );
        }
        var tbody = this.renderTbody();
        var tfoot = this.renderTfoot();

        thead.childNodes[0].childNodes[this.orderBy.defaultColumnIndex].setAttribute ( 'class', this.orderBy.det );

        table.appendChild ( thead );
        table.appendChild ( tbody );
        table.appendChild ( tfoot );







    };

    renderThead() {
        var thead = this.crtNodeElement('thead');
        var sorting = this.sorting;
        var t = this;
        var column = this.column;
        var tr = this.crtNodeElement ( 'tr' );
        thead.appendChild ( tr );

        for ( var i of column ) {
            var th = this.crtNodeElement ( 'th', i.title );
            tr.appendChild ( th );
            if (sorting) {
                th.addEventListener ( 'click', function (event) {
                    var target = event.target;
                    var targetIndex = t.findChildNodeIndex ( event.target );
                    t.orderBy.columnIndex = targetIndex;
                    if (target.getAttribute ( 'class' ) === "ASC") {
                        target.setAttribute ( 'class', "DESC" );
                        t.orderBy.det = "DESC";
                        t.data = t.sortTable ( targetIndex, t.orderBy.det, t.data );

                    } else if (target.getAttribute ( 'class' ) === "DESC") {
                        target.setAttribute ( 'class', "ASC" );
                        t.orderBy.det = "ASC";
                        t.data = t.sortTable ( targetIndex, t.orderBy.det, t.data );
                    }
                    if (!target.getAttribute ( 'class' )) {
                        for ( var child of tr.childNodes ) {
                            child.removeAttribute ( 'class' );
                        }
                        target.setAttribute ( 'class', "ASC" );
                        t.orderBy.det = 'ASC';
                        t.data = t.sortTable ( targetIndex, t.orderBy.det, t.data );
                    }
                    var tbody = t.renderTbody ();
                    thead.parentNode.removeChild(thead.parentNode.childNodes[1]);
                    thead.insertAdjacentElement('afterend', tbody );
                } );
                th.setAttribute ( 'style', 'cursor:pointer' );
            }
        }
        return thead;
    };

    renderTbody() {
        var tbody = this.crtNodeElement ( 'tbody' );
        var data = this.data;
        var column = this.column;

        if (data.length !== 0) {
            for ( var j of data ) {
                var tr = this.crtNodeElement ( 'tr' );
                tbody.appendChild ( tr );
                for ( var k of column ) {

                    var td = this.crtNodeElement ( 'td', j[column.indexOf ( k )] );
                    tr.appendChild ( td );
                }
            }
        } else {
            var tr__notFound = this.crtNodeElement ( 'tr' );
            var td__notFound = this.crtNodeElement (
                'td',
                'Not Found',
                {
                    name: 'colspan',
                    value: column.length
                } ,
            );
            tr__notFound.appendChild ( td__notFound );
            tbody.appendChild ( tr__notFound );
        }
        return tbody;
    };

    renderTfoot() {
        var tfoot = this.crtNodeElement ( 'tfoot' );
        var data = this.data;
        var column = this.column;
        var pagination = this.pagination;


        var tr = this.crtNodeElement ( 'tr' )
        tfoot.appendChild ( tr );
        for ( var i of column ) {
            var th = this.crtNodeElement ( 'th', `${i.title}` );
            tr.appendChild ( th );
        }

        if (pagination.bool) {
            var t = this;
            var paginationSectionElm = this.crtNodeElement (
                'tr',
                '',
                {
                    name: 'class',
                    value: 'paginationSection',
                }
            );

            var divSelectElm = this.crtNodeElement (
                'div',
                '',
                {
                    name: 'class',
                    value: 'divSelect'
                }
            );
            // var selectElm = this.crtNodeElement ( 'select' );
            // for ( var j = 1; j <= pagesDefault; j ++ ) {
            //     if (j * rowsPerPage > data.length) {
            //         optionElm = t.crtNodeElement ( 'option', `${data.length}` );
            //         selectElm.appendChild ( optionElm );
            //         break;
            //     }
            //     var optionElm = t.crtNodeElement ( 'option', `${j * rowsPerPage}` );
            //     selectElm.appendChild ( optionElm );
            // }
            // selectElm.appendChild ( optionElm );
            // divSelectElm.appendChild ( selectElm );
            // paginationSectionElm.appendChild ( divSelectElm );



            // selectElm.addEventListener('change',function( event ){
            //     rowsPerPage = Number(event.target.value);
            //     t.paginationTable( rowsPerPage, tbody, divPaginationElm, t.data );
            // });
        }

        return tfoot;
    };

    searchTable(val) {
        var data = this.allData;
        var column = this.column;
        var filteredData = [];
        for ( var dataItem of data ) {
            for ( var columnItem of column ) {
                var columnIndex = column.indexOf ( columnItem );
                var dataField = dataItem[columnIndex].replace ( / /g, "" ).toLowerCase ();

                if (dataField.indexOf ( val ) !== - 1) {
                    filteredData.push ( dataItem );
                    break;
                }
            }
        }
        return filteredData;

    };

    sortTable(sortableColumnIndex, orderBy, data) {

        return data.sort ( (a, b) => {
            if (orderBy === "ASC") {
                if (a[sortableColumnIndex].toLowerCase () < b[sortableColumnIndex].toLowerCase ()) {
                    return - 1;
                }
                if (a[sortableColumnIndex].toLowerCase () > b[sortableColumnIndex].toLowerCase ()) {
                    return 1;
                }
                return 0;
            } else if (orderBy === "DESC") {
                if (a[sortableColumnIndex].toLowerCase () > b[sortableColumnIndex].toLowerCase ()) {
                    return - 1;
                }
                if (a[sortableColumnIndex].toLowerCase () < b[sortableColumnIndex].toLowerCase ()) {
                    return 1;
                }
                return 0;
            }
        } );
    };

    createPagination( data = this.sortTable ( this.orderBy.defaultColumnIndex, this.orderBy.det, this.allData ) ) {
        var t = this;
        var rowsPerPage = this.pagination.rows;
        var pages = Math.ceil ( data.length / rowsPerPage );
        var currentPage = 1;
        var divPaginationElm = this.crtNodeElement (
            'div',
            '',
            {
                name: 'class',
                value: 'divPagination',
            }
        );
        for ( var k = 1; k <= pages; k++ ) {
            var linkElm = this.crtNodeElement (
                'a',
                k,
                {
                    name: 'class',
                    value: 'pagination__links'
                },
            );

            linkElm.addEventListener ( 'click', function (event) {
                currentPage = Number(event.target.childNodes[0].data);
                t.data = data.slice( (currentPage-1)*rowsPerPage, currentPage*rowsPerPage );
                var tbody = t.renderTbody ();
                var oldTableIndex = t.findChildNodeIndex( divPaginationElm ) - 1;
                var oldTbodyIndex = divPaginationElm.parentNode.childNodes[ oldTableIndex ].childNodes[ oldTableIndex - 1 ];
                divPaginationElm.parentNode.childNodes[ oldTableIndex ].removeChild( oldTbodyIndex );
                var thead = divPaginationElm.parentNode.childNodes[oldTableIndex].childNodes[0] ;
                thead.insertAdjacentElement('afterend', tbody );
            } );
            divPaginationElm.appendChild ( linkElm );
        }
        t.data = data.slice ( (currentPage - 1) * rowsPerPage, currentPage * rowsPerPage );

        return divPaginationElm;
    };

    removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild ( parent.firstChild );
        }
    };

    findChildNodeIndex(target) {

        var currentParent = target.parentNode.childNodes;
        var targetIndex;
        for ( var j = 0; j < currentParent.length; ++ j ) {
            if (target === currentParent[j]) {
                targetIndex = j;
                break;
            }
        }
        return targetIndex;
    };

    crtNodeElement(tag, text, attr) {

        var element = document.createElement ( tag );
        if (text) {
            var textNode = document.createTextNode ( text );
            element.appendChild ( textNode )
        }
        if (attr) {
            element.setAttribute ( attr.name, attr.value );
        }


        return element;
    }

}


document.addEventListener ( 'DOMContentLoaded', function () {
    var dataSet = [
        ["Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750"],
        ["Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000"],
        ["Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060"],
        ["Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700"],
        ["Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000"],
        ["Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500"],
        ["Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900"],
        ["Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500"],
        ["Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600"],
        ["Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560"],
        ["Quinn Flynn", "Support Lead", "Edinburgh", "9497", "2013/03/03", "$342,000"],
        ["Charde Marshall", "Regional Director", "San Francisco", "6741", "2008/10/16", "$470,600"],
        ["Haley Kennedy", "Senior Marketing Designer", "London", "3597", "2012/12/18", "$313,500"],
        ["Tatyana Fitzpatrick", "Regional Director", "London", "1965", "2010/03/17", "$385,750"],
        ["Michael Silva", "Marketing Designer", "London", "1581", "2012/11/27", "$198,500"],
        ["Paul Byrd", "Chief Financial Officer (CFO)", "New York", "3059", "2010/06/09", "$725,000"],
        ["Gloria Little", "Systems Administrator", "New York", "1721", "2009/04/10", "$237,500"],
        ["Bradley Greer", "Software Engineer", "London", "2558", "2012/10/13", "$132,000"],
        ["Dai Rios", "Personnel Lead", "Edinburgh", "2290", "2012/09/26", "$217,500"],
        ["Jenette Caldwell", "Development Lead", "New York", "1937", "2011/09/03", "$345,000"],
        ["Yuri Berry", "Chief Marketing Officer (CMO)", "New York", "6154", "2009/06/25", "$675,000"],
        ["Caesar Vance", "Pre-Sales Support", "New York", "8330", "2011/12/12", "$106,450"],
        ["Doris Wilder", "Sales Assistant", "Sydney", "3023", "2010/09/20", "$85,600"],
        ["Angelica Ramos", "Chief Executive Officer (CEO)", "London", "5797", "2009/10/09", "$1,200,000"],
        ["Gavin Joyce", "Developer", "Edinburgh", "8822", "2010/12/22", "$92,575"],
        ["Jennifer Chang", "Regional Director", "Singapore", "9239", "2010/11/14", "$357,650"],
        ["Brenden Wagner", "Software Engineer", "San Francisco", "1314", "2011/06/07", "$206,850"],
        ["Fiona Green", "Chief Operating Officer (COO)", "San Francisco", "2947", "2010/03/11", "$850,000"],
        ["Shou Itou", "Regional Marketing", "Tokyo", "8899", "2011/08/14", "$163,000"],
        ["Michelle House", "Integration Specialist", "Sydney", "2769", "2011/06/02", "$95,400"],
        ["Suki Burks", "Developer", "London", "6832", "2009/10/22", "$114,500"],
        ["Prescott Bartlett", "Technical Author", "London", "3606", "2011/05/07", "$145,000"],
        ["Gavin Cortez", "Team Leader", "San Francisco", "2860", "2008/10/26", "$235,500"],
        ["Martena Mccray", "Post-Sales support", "Edinburgh", "8240", "2011/03/09", "$324,050"],
        ["Unity Butler", "Marketing Designer", "San Francisco", "5384", "2009/12/09", "$85,675"]
    ];


    document.querySelector ( '#app' ).DataTable ( {
        data: dataSet,
        column: [
            {title: "Name"},
            {title: "Position"},
            {title: "Office"},
            {title: "Ext."},
            {title: "Start Date"},
            {title: "Salary"},
        ]

    } );


} );

Object.prototype.DataTable = function (args) {
    const selector = this;
    const dataTable = new Table ( selector, args );
};
