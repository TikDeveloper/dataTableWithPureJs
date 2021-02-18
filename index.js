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
                currentPage: 1,
            },
            orderBy = {
                defaultColumnIndex: 0,
                det: "ASC",
            },
            ...otherOptions
        }
    ) {

        this.selector = selector;
        this.allData = data;
        this.allDataClone = data;
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
        this.tbody = this.crtNodeElement ('tbody');
        this.thead = this.crtNodeElement('thead');
        this.tfoot = this.crtNodeElement ( 'tfoot' );
        var t = this;

        if (this.search) {
            this.selector.innerHTML =
                '<div class="headerSection">' +
                '<input type="text" placeholder="Search" id="searchInp"/>' +
                '</div>';

        }
        this.selector.appendChild( table );


        if(this.pagination.bool){
            var divSelectElm =
                '<div class="divSelect">' +
                    '<select id="rowsSelect">' +
                        '<option value="' + this.pagination.rows + '"> ' + this.pagination.rows + ' </option>' +
                        '<option value="' + (this.pagination.rows+15) + '"> ' + (this.pagination.rows+15) + ' </option>' +
                        '<option value="' + this.allData.length + '"> All </option>' +
                    '</select>' +
                '</div>';
            var divPaginationElm  = this.createPagination ();



            table.insertAdjacentHTML( 'afterend', divSelectElm );
            table.insertAdjacentHTML( 'afterend', divPaginationElm );

        }


        this.renderThead();
        this.renderTbody();
        this.renderTfoot();



        table.appendChild( this.thead );
        table.appendChild( this.tbody );
        table.appendChild( this.tfoot );


        window.onload = function(){
            if(t.sorting) {
                document.querySelectorAll ( '.column__headings' ).forEach ( item => {
                    if (item.addEventListener) {
                        item.addEventListener ( "click", sortClick, false );
                    } else if (item.attachEvent) {
                        item.attachEvent ( "click", sortClick );
                    }
                });
            }
            if(t.pagination.bool) {
                document.querySelectorAll('.pagination__links').forEach(item => {
                    if (item.addEventListener) {
                        if( item.className.indexOf( 'nextPage' ) !== -1 ) {
                            item.addEventListener("click", paginationClickNext, false);
                        }
                        else if( item.className.indexOf( 'prevPage' ) !== -1 ) {
                            item.addEventListener("click", paginationClickPrev, false);
                        }
                        else {
                            item.addEventListener("click", paginationClick, false);
                        }
                    }
                    else if (item.attachEvent) {
                        if( item.className.indexOf( 'nextPage' ) !== -1 ) {
                            item.attachEvent("click", paginationClickNext);
                        }
                        else if( item.className.indexOf( 'prevPage' ) !== -1 ) {
                            item.attachEvent("click", paginationClickPrev);
                        }
                        else {
                            item.attachEvent("click", paginationClick);
                        }
                    }
                });
                var rowsSelect = document.querySelector('#rowsSelect');
                if (rowsSelect.addEventListener) {
                    rowsSelect.addEventListener("change", selectChange, false);
                }
                else if (rowsSelect.attachEvent) {
                    rowsSelect.attachEvent("change", selectChange);
                }

            }
            if(t.search) {
                var searchInp = document.querySelector('#searchInp');
                if (searchInp.addEventListener) {
                    searchInp.addEventListener("keyup", searchHandle, false);
                } else if (searchInp.attachEvent) {
                    searchInp.attachEvent("keyup", searchHandle);
                }
            }

            function sortClick(event) {
                var target = event.target;
                if (target.className.indexOf ( 'ASC' ) !== - 1) {
                    target.className = "column__headings DESC";
                    t.orderBy.det = "DESC";
                } else if (target.className.indexOf ( 'DESC' ) !== - 1) {
                    target.className = "column__headings ASC";
                    t.orderBy.det = "ASC";
                }
                if (target.className.indexOf ( 'ASC' ) === - 1 && target.className.indexOf ( 'DESC' ) === - 1) {
                    document.querySelectorAll ( '.column__headings' ).forEach ( item => {
                        item.className = 'column__headings';
                    } );
                    target.className = "column__headings ASC";
                    t.orderBy.det = "ASC";
                }
                var targetIndex = t.findChildNodeIndex ( event.target );
                t.orderBy.defaultColumnIndex = targetIndex;
                t.pagination.currentPage = 1;
                t.data = t.sortTable ( targetIndex, t.orderBy.det );
                var divPaginationElm = t.createPagination( t.data );
                t.renderTbody ();
                clearOldElmAndAddEvents( divPaginationElm );
            }

            function paginationClick(event) {
                var currentPage = Number( event.target.childNodes[0].data );

                document.querySelectorAll ( '.page' ).forEach ( (item,index) => {
                    if( index === currentPage - 1 ) {
                        item.className = 'pagination__links page activePage';
                    }
                    else{
                        item.className = 'pagination__links page';
                    }
                });

                t.pagination.currentPage = currentPage;
                var divPaginationElm = t.createPagination();
                t.renderTbody();
                clearOldElmAndAddEvents( divPaginationElm );
            }

            function selectChange(event) {
                t.pagination.rows = event.target.value;
                t.pagination.currentPage = 1;
                var divPaginationElm = t.createPagination();
                t.renderTbody();
                clearOldElmAndAddEvents( divPaginationElm );
            }

            function searchHandle(event) {
                var val = event.target.value.replace ( / /g, "" ).toLowerCase ();
                var searchedData = t.searchTable ( val );
                t.data = t.sortTable ( t.orderBy.defaultColumnIndex, t.orderBy.det, searchedData );
                t.allData = searchedData;
                if(t.pagination.bool){
                    var divPaginationElm = t.createPagination( t.data );
                    clearOldElmAndAddEvents( divPaginationElm );
                }
                t.renderTbody();
            }

            function paginationClickNext(event) {
                t.pagination.currentPage = t.pagination.currentPage + 1;
                var divPaginationElm = t.createPagination();
                t.renderTbody();
                clearOldElmAndAddEvents( divPaginationElm );
            }

            function paginationClickPrev(event) {
                t.pagination.currentPage = t.pagination.currentPage - 1;
                var divPaginationElm = t.createPagination();
                t.renderTbody();
                clearOldElmAndAddEvents( divPaginationElm );
            }

            function clearOldElmAndAddEvents( divPaginationElm ){
                t.selector.removeChild( t.selector.childNodes[ t.selector.childNodes.length - 2 ] );
                table.insertAdjacentHTML( 'afterend', divPaginationElm );
                document.querySelectorAll('.pagination__links').forEach(item => {
                    if (item.addEventListener) {
                        if( item.className.indexOf( 'nextPage' ) !== -1 ) {
                            item.addEventListener("click", paginationClickNext, false);
                        }
                        else if( item.className.indexOf( 'prevPage' ) !== -1 ) {
                            item.addEventListener("click", paginationClickPrev, false);
                        }
                        else {
                            item.addEventListener("click", paginationClick, false);
                        }
                    }
                    else if (item.attachEvent) {
                        if( item.className.indexOf( 'nextPage' ) !== -1 ) {
                            item.attachEvent("click", paginationClickNext);
                        }
                        else if( item.className.indexOf( 'prevPage' ) !== -1 ) {
                            item.attachEvent("click", paginationClickPrev);
                        }
                        else {
                            item.attachEvent("click", paginationClick);
                        }
                    }
                });
            }
        }




    };

    renderThead() {
        var thead = this.thead;
        var t = this;
        var column = this.column;
        var tr = '<tr>';

        for ( var i = 0; i < column.length; i++ ) {
            if(i === this.orderBy.defaultColumnIndex){
                tr += '<th class="column__headings '+ this.orderBy.det +' ">'+ column[i].title +'</th>';
            }
            else{
                tr += '<th class="column__headings">'+ column[i].title +'</th>';
            }
        }
        tr += '</tr>';
        thead.innerHTML = tr;

    };

    renderTbody() {
        var tbody = this.tbody;
        var data = this.data;
        var column = this.column;
        tbody.innerHTML = '';
        if (data.length !== 0) {
            for ( var j of data ) {
                 var tr = '<tr>';
                    for ( var k of column ) {
                        tr += '<td>' + j[column.indexOf ( k )] + '</td>';
                    }
                tr += '</tr>';
                tbody.innerHTML += tr;
            }
        } else {
            tbody.innerHTML =
                '<tr>' +
                    '<td colspan=' + column.length + '>' + 'Not Found' + '</td>' +
                '</tr>';
        }
    };

    renderTfoot() {
        var tfoot = this.tfoot;
        var column = this.column;

        var tr = this.crtNodeElement ( 'tr' )
        tfoot.appendChild ( tr );
        for ( var i of column ) {
            var th = this.crtNodeElement ( 'th', `${i.title}` );
            tr.appendChild ( th );
        }

    };

    searchTable(val) {
        var data = this.allDataClone;
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

    sortTable(sortableColumnIndex, orderBy, data = this.allData ) {

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
        var currentPage = t.pagination.currentPage;
        var currentPageBefore = currentPage - 1;
        var currentPageAfter = currentPage + 1;

        var divPaginationElm = '<div class="divPagination">' ;
        if( currentPage > 1 ){
            divPaginationElm += '<a class="pagination__links prevPage"> Previous </a>';
        }
        if( pages >= 7){
            if( currentPage > 2 ){
                divPaginationElm += '<a class="pagination__links page"> 1 </a>';
                if( currentPage > 3 ){
                    divPaginationElm += '<a class="pagination__links"> ... </a>';
                }
            }
            if( currentPage === pages ){
                currentPageBefore = currentPageBefore - 1;
            }
            if( currentPage === 1 ){
                currentPageAfter = currentPageAfter + 1;
            }
        }
        else{
            currentPageBefore = 0;
            currentPageAfter = pages;
        }
        for ( var k = currentPageBefore; k <= currentPageAfter; k++ ) {
            if( k > pages ){
                continue;
            }
            if( k === 0 ){
                k = k + 1;
            }


            if(currentPage === k){
                divPaginationElm +=
                    '<a class="pagination__links page activePage" >'+
                    k +
                    '</a>';
            }
            else{
                divPaginationElm +=
                    '<a class="pagination__links page" >'+
                    k +
                    '</a>';
            }
        }
        if( pages >= 7){
            if( currentPage < pages - 1 ){
                if( currentPage < pages - 2 ){
                    divPaginationElm += '<a class="pagination__links"> ... </a>';
                }
                divPaginationElm += '<a class="pagination__links page"> ' + pages + ' </a>';
            }
        }
        if(currentPage < pages){
            divPaginationElm += '<a class="pagination__links nextPage"> Next </a>';
        }


        divPaginationElm += '</div>';
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
    };

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


    document.querySelector ( '#example' ).DataTable ( {
        data: dataSet,
        column: [
            {title: "Name"},
            {title: "Position"},
            {title: "Office"},
            {title: "Ext."},
            {title: "Start Date"},
            {title: "Price"},
        ]

    });

} );

Object.prototype.DataTable = function (args) {
    const selector = this;
    const dataTable = new Table ( selector, args );
};
