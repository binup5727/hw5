var docurrency = function(){
    
    console.log("GETTING CURRENCY");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let currency = JSON.parse(this.responseText);
            console.log(currency);
            buildcurrency(currency);
        }
    };
     url = 'https://api.exchangeratesapi.io/latest?base=USD'
        
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}


function buildcurrency(currency){
    let workspace = document.getElementById("content");
    workspace.innerHTML = "";

    

    const content = $('#content');

    content.append('<h1>Binup Mathai Z23283452</h1>');

    const table = $('<table></table>');
    table.addClass("table table-striped table-bordered"); const tr = '<tr></tr>';

    const frow = $(tr);
    frow.append('<th>Currency</th>, <th>Rate Per USD</th>');
    table.append(frow);

    const keys = Object.keys(currency);
    const ratekey = Object.keys(currency.rates);

    for (let i = 0; i < ratekey.length; i++) {
        console.log(keys, ratekey, ratekey[0]);
        const th = `<th>${ratekey[i]}</th>`;
        const td = `<td>${currency['rates'][ratekey[i]]}</td>`;




        const rows = $(tr)



        table.append(rows);
        rows.append(th, td);

        content.html(table);
    }
    //TODO : CURRENCY DATA IS IN JSON OBJECT currency
    //All you need to do is build it into content.
    

}

