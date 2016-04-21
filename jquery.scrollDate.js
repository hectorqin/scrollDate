(function($) {
    jQuery.scrollDate = function(options) {
        var defaults={
            'm_e':["January","February","March","April","May","June","July","August","September","October","November","December"],
            'm_e_s':["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
            'm_c':["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
            'w_e':["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            'w_e_s':["Sun","Mon","Tue","Wed","Thur","Fri","Sat"],
            'w_c':["日","一","二","三","四","五","六"],
            'd':[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        }

        function getDate(date){
            var date=date?date:new Date();
            return date.getFullYear()+'-'+packZero(date.getMonth()+1)+'-'+packZero(date.getDate());
        }

        function packZero(n){
            return parseInt(n)<10?('0'+n):n;
        }

        function dayCount(year,month){   
            return new Date(year,month,0).getDate(); 
        }     


        var options = jQuery.extend(defaults, options);
        var scrollDate=function(options){
            this.row=[];
            this.type=0;
            this.rowCount=6;
            this.debug=options.debug||0;
            this.date='';
            this.year='';
            this.month='';
            this.day='';
            this.week='';

            this.init=function(){
                this.setType(options.type||0);
                this.createContainer(options.selector||"body");
                this.createTable();
                this.bindEvent();
                this.initDate(options.date||getDate());
                this.setTable();
            };

            this.setType=function(type){
                this.type=type;
                this.rowCount=type?1:6;
            };  

            this.initDate=function(date,callback){
                date=date.replace(/[-.\s]/g,'/');
                date=new Date(date);
                if(isNaN(date.getFullYear())){
                    console.error('invalid date');
                    return false;
                }
                this.date=getDate(date);
                this.year=date.getFullYear();
                this.month=date.getMonth()+1;
                this.day=date.getDate();
                this.week=date.getDay();
                this.setMonthDateArr();
                this.setWeekDateArr();
                callback&&callback(this.date);
            }

            this.createContainer=function(selector){
                this.container = $("<div class='scrollDate'></div>").appendTo($(selector));
            };

            this.createTable=function(reset){
                if(!this.container){
                    this.createContainer(options.selector||"body");
                }
                if(reset){this.container.html('');this.row=[]}
                this.table = $("<table bgcolor=white border=0 cellspacing = 0 cellpading = 0 width=100%></table>").appendTo(this.container);
                this.th    = $(this.getRow("th")).appendTo(this.table);
                for(var i=0;i<this.rowCount;i++){
                    this.row.push($(this.getRow("td")).appendTo(this.table));
                }
                this.setTh();
            };

            this.setTable=function(){
                if(this.rowCount==1){
                    var days=this.weekDateArr.slice(0);
                }else{
                    var days=this.fullDateArr.slice(0);
                }
                var rows=this.row.slice(0);
                for(var i=0;i<this.rowCount;i++){
                    var d=days.splice(0,7);
                    this.setRow(rows.shift(),'td',d);
                }
            };

            this.setMonthDateArr=function(){
                this.monthDateArr=options.d.slice(0,dayCount(this.year,this.month));
                this.packFullDateArr();
            };

            this.setWeekDateArr=function(){
                var arr=this.fullDateArr.slice(0);
                var k=$.inArray(this.date, arr);
                this.weekDateArr=arr.slice(k-this.week,k+7-this.week);
            };

            this.packFullDateArr=function(){
                var arr=this.packFull(this.monthDateArr.slice(0),this.year,this.month);
                var begin_w=new Date(this.year,this.month-1,1).getDay();
                if(begin_w>0){
                    var pref=this.packFull(options.d.slice(0,dayCount(this.year,this.month-1)).slice(-begin_w),this.year,this.month-1);
                }else{
                    var pref=[];
                }
                var suf=this.packFull(options.d.slice(0,this.rowCount*7-begin_w-arr.length),this.year,this.month+1);
                this.fullDateArr=pref.concat(arr).concat(suf);
            };

            this.packFull=function(arr,year,month){
                if(month>12){
                    year+=1;
                    month-=12;
                }else if(month==0){
                    year-=1;
                    month=12;
                }
                $.each(arr,function(i,item){
                    arr[i]=year+'-'+packZero(month)+'-'+packZero(item);
                });
                return arr;
            };

            this.bindEvent=function(){
                var self=this;
                this.container.delegate('.date-cell','click',function(){
                    var value=$(this).attr('data-date');
                    self.setDate(value);
                    console.log(value);
                    options.click&&options.click(value);
                });
            };

            this.formateDate=function(year,month,day){
                if(month>12){
                    year+=1;
                    month-=12;
                }else if(month==0){
                    year-=1;
                    month=12;
                }
                return (year||this.year)+'-'+packZero(month||this.month)+'-'+packZero(day||this.day);
            };

            this.next=function(callback){
                this.type?this.nextWeek(callback):this.nextMonth(callback);
            };

            this.last=function(callback){
                this.type?this.lastWeek(callback):this.lastMonth(callback);
            };

            this.weeklyCalendar=function(){
                if(this.type){
                    return true;
                }else{
                    this.setType(1);
                    this.createTable(true);
                    this.setDate(this.date);
                }
            }

            this.monthlyCalendar=function(){
                if(!this.type){
                    return true;
                }else{
                    this.setType(0);
                    this.createTable(true);
                    this.setDate(this.date);
                }
            }

            this.nextWeek=function(callback){
                var d=new Date(this.date);
                d.setDate(d.getDate()+7);
                var _date=getDate(d);
                this.setDate(_date,callback);
                // callback&&callback(_date);
            };

            this.lastWeek=function(callback){
                var d=new Date(this.date);
                d.setDate(d.getDate()-7);
                var _date=getDate(d);
                this.setDate(_date,callback);
                // callback&&callback(_date);
            };

            this.nextMonth=function(callback){
                var _date=this.formateDate(this.year,this.month+1,this.day);
                this.setDate(_date,callback);
                // callback&&callback(_date);
            };

            this.lastMonth=function(callback){
                var _date=this.formateDate(this.year,this.month-1,this.day);
                this.setDate(_date,callback);
                // callback&&callback(_date);
            };

            this.setDate=function(date,callback){
                this.initDate(date,callback);
                this.setTable();
            }

            this.getRow=function(tag){
                var s="<tr>";
                for(var i=0;i<7;i++){
                    s+="<"+tag+"></"+tag+">";
                }
                return s+"</tr>";
            };

            this.setRow=function(row,tag,data){
                var self=this;
                $(row).find(tag).each(function(){
                    var i=$(this).index();
                    if(self.debug){
                        $(this).html(data[i]);
                    }else{
                        $(this).html(data[i].split('-')[2]);
                    }
                    $(this).attr('class','');
                    $(this).addClass(data[i]+' date-cell');
                    $(this).attr('data-date',data[i]);
                    if(self.type==1){
                        $(this).addClass('weekly');
                    }else{
                        $(this).addClass('monthly');
                        if(parseInt(data[i].split('-')[1])==self.month){
                            $(this).addClass('thisMonth');
                        }
                    }    
                    if(data[i]==self.date){
                        $(this).addClass('thisDay');
                    }
                });
            };

            this.setTh=function(){
                $(this.th).find('th').each(function(){
                    var i=$(this).index();
                    $(this).html(options.w_c[i]);
                });
            };

            this.init();
        }

        return new scrollDate(options);
    }
})(jQuery);