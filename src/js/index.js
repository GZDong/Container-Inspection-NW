window.onload = preparelinks;
function preparelinks() {
    requestData();
    var links = document.getElementsByTagName("button");
    for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute("id") == "importBtn") {
            links[i].onclick = function () {
                var chooser = document.querySelector('#fileDialog');
                chooser.click();
                chooser.addEventListener("change", function (evt) {   //选择文件并点击确认后触发
                    var files = chooser.files[0];
                    var fileReader = new FileReader();
                    fileReader.onload = function (ev) {   //下面的read方法执行后触发
                        try {
                            var data = ev.target.result;
                            var workbook = XLSX.read(data, {
                                type: 'binary'
                            });

                            var roa = JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
                            var obj = JSON.parse(roa);

                            for (var i = 0; i < obj.length; i++) {
                                var element = document.createElement('tr');

                                var no = document.createElement('td');
                                no.innerHTML = obj[i].no;

                                var ConNo = document.createElement('td');
                                ConNo.innerHTML = obj[i].ConNo;
                                //var cn = obj[i].ConNo;

                                var Company = document.createElement('td');
                                Company.innerHTML = obj[i].Company;
                                Company.addEventListener('dblclick', function (evt) {
                                    ShowElement(this);
                                });

                                var Wash = document.createElement('td');
                                Wash.innerHTML = obj[i].Wash;
                                Wash.addEventListener('dblclick', function (evt) {
                                    showOrHidden(this, 1);
                                });

                                var Repair = document.createElement('td');
                                Repair.innerHTML = obj[i].Repair;
                                Repair.addEventListener('dblclick', function (evt) {
                                    showOrHidden(this, 2);
                                });

                                var Options = document.createElement('td');
                                var checkbox = document.createElement('input');
                                checkbox.setAttribute('type', 'checkbox');
                                checkbox.setAttribute('class', 'op');
                                checkbox.style.display = 'none';
                                checkbox.style.width = '10px';
                                Options.appendChild(checkbox);

                                element.appendChild(no);
                                element.appendChild(ConNo);
                                element.appendChild(Company);
                                element.appendChild(Wash);
                                element.appendChild(Repair);
                                element.appendChild(Options);
                                document.getElementById("body").appendChild(element);
                            }
                        } catch (e) {
                            console.log('文件类型不正确');
                            return;
                        }
                    };
                    fileReader.readAsBinaryString(files);
                }, false);
            }
        }
    }

    var delbtn = document.getElementById('delbtn');
    delbtn.addEventListener('click', function (evt) {
        var option = [];
        var Option = document.getElementById("option");
        option = document.getElementsByClassName('op');
        for (var i = 0; i < option.length; i++) {
            if (option[i].style.display == "none") {
                Option.style.display = 'block';
                option[i].style.display = 'block';
                this.innerText = '确定';
            } else {
                Option.style.display = 'none';
                option[i].style.display = 'none';
                this.innerText = '删除';
            }
        }
        var body = document.getElementById('body');
        if (this.innerText == '删除') {
            var index;
            for (var i = 0; i < option.length; i++) {
                if (option[i].checked) {
                    body.deleteRow(i);
                    index = i;
                }
                if (i >= index) {
                    body.rows[i].cells[0].innerText = parseInt(body.rows[i].cells[0].innerText) - 1;
                }
            }
        }
    });

    var addbtn = document.getElementById('addbtn');
    addbtn.addEventListener('click', function (evt) {
        var display = document.getElementById("add");
        if (display.style.display == "block") {
            display.style.display = "none";
            this.innerText = '添加';
        } else {
            display.style.display = "block";
            this.innerText = '取消';
        }
    });

    var subbtn = document.getElementById('submitbtn');
    subbtn.addEventListener('click', function (evt) {
        var body = document.getElementById('body');
        // var no = body.length +1;
        var conno = document.getElementById('conno').value;
        var company = document.getElementById('company').value;


        var element = document.createElement('tr');

        var no = document.createElement('td');
        no.innerText = body.rows.length + 1;

        var ConNo = document.createElement('td');
        ConNo.innerHTML = conno;
        //var cn = obj[i].ConNo;

        var Company = document.createElement('td');
        Company.innerHTML = company;
        Company.addEventListener('dblclick', function (evt) {
            ShowElement(this);
        });

        var Wash = document.createElement('td');
        Wash.innerText = '未洗';
        Wash.addEventListener('dblclick', function (evt) {
            showOrHidden(this, 1);
        });

        var Repair = document.createElement('td');
        Repair.innerText = '未修';
        Repair.addEventListener('dblclick', function (evt) {
            showOrHidden(this, 2);
        });

        var Options = document.createElement('td');
        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('class', 'op');
        checkbox.style.display = 'none';
        checkbox.style.width = '10px';
        Options.appendChild(checkbox);

        element.appendChild(no);
        element.appendChild(ConNo);
        element.appendChild(Company);
        element.appendChild(Wash);
        element.appendChild(Repair);
        element.appendChild(Options);
        body.appendChild(element);
        return;

    });

    var refbtn = document.getElementById('refreshBtn');
    refbtn.addEventListener('click', function (evt) {
        var count = document.getElementById('body').childElementCount;
        if (count > 0) {
            for (i = 0; i < count; i++) {
                var node = document.getElementById('bodynode' + i);
                node.parentNode.removeChild(node);
            }
        }
        requestData();
    });


    function requestData() {
        var obj;
        var url = "http://146.222.94.31:3000/containers/getAll/";
        var request = require('request');
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                obj = JSON.parse(body);
                if (obj.length > 0) {
                    if (document.getElementById('body') != null) {
                        // alert('body no null and eleList no zero,and eleList size is: ' + eleList.length);

                        for (var i = 0; i < obj.length; i++) {
                            //alert('obj' + i + ': ' + obj[i]);
                            var element = document.createElement('tr');
                            element.id = 'bodynode' + i;
                            var no = document.createElement('td');
                            no.innerText = i + 1;
                            var ConNo = document.createElement('td');

                            ConNo.innerHTML = obj[i].containerNo;
                            //var cn = obj[i].ConNo;

                            var Company = document.createElement('td');
                            Company.innerHTML = obj[i].company.companyName;
                            Company.addEventListener('dblclick', function (evt) {
                                ShowElement(this);
                            });

                            var Wash = document.createElement('td');
                            Wash.innerText = "未洗";
                            Wash.addEventListener('dblclick', function (evt) {
                                showOrHidden(this, 1);
                            });

                            var Repair = document.createElement('td');
                            Repair.innerText = "未修";
                            Repair.addEventListener('dblclick', function (evt) {
                                showOrHidden(this, 2);
                            });
                            var Options = document.createElement('td');
                            var checkbox = document.createElement('input');
                            checkbox.setAttribute('type', 'checkbox');
                            checkbox.setAttribute('class', 'op');
                            checkbox.style.display = 'none';
                            checkbox.style.width = '10px';
                            Options.appendChild(checkbox);

                            element.appendChild(no);
                            element.appendChild(ConNo);
                            element.appendChild(Company);
                            element.appendChild(Wash);
                            element.appendChild(Repair);
                            element.appendChild(Options);
                            document.getElementById("body").appendChild(element);
                        }
                    }
                }
            }
        });
    }

    function ShowElement(element) {
        var oldhtml = element.innerText;
        //如果已经双击过，不进行任何操作
        if (oldhtml.indexOf('type="text"') > 0) {
            return;
        }
        //创建新的input元素
        var newobj = document.createElement('input');
        //为新增的元素添加type
        newobj.type = 'text';
        newobj.value = oldhtml;
        //光标离开时
        newobj.onblur = function () {
            element.innerText = this.value == oldhtml ? oldhtml : this.value;
        }
        newobj.style.width = '70px';
        element.innerText = '';
        element.appendChild(newobj);
        newobj.setSelectionRange(0, oldhtml.length);
        newobj.focus();
    }

    function showOrHidden(element, tag) {
        var oldhtml = element.innerText;
        //如果已经双击过，不进行任何操作
        if (oldhtml.indexOf('type="text"') > 0) {
            return;
        }
        //创建新的input元素
        var newobj = document.createElement('select');
        newobj.style.paddingLeft = '2px';
        newobj.style.paddingRight = '2px';
        //为新增的元素添加type
        //newobj.type = 'checkbox';
        var op1 = document.createElement('option');
        var op2 = document.createElement('option');
        var op3 = document.createElement('option');
        if (tag == 1) {
            op1.value = "未洗";
            op1.innerText = "未洗";

            op2.value = "已洗";
            op2.innerText = '已洗';

            op3.value = "-";
            op3.innerText = '-';
        } else {
            op1.value = "未修";
            op1.innerText = "未修";

            op2.value = "已修";
            op2.innerText = '已修';

            op3.value = "-";
            op3.innerText = '-';
        }

        newobj.appendChild(op1);
        newobj.appendChild(op2);
        newobj.appendChild(op3);
        newobj.value = oldhtml;
        //光标离开时
        newobj.onblur = function () {
            element.innerText = this.value == oldhtml ? oldhtml : this.value;
        }

        element.innerText = '';
        element.appendChild(newobj);
    }
}

