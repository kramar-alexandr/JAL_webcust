const kTileProducts = 0
const kTileSMUs = 1;


$(document).ready(function(){
  
  //set filters

  //set search

  //set type switch 
  let test = new ShopApp();
  UpdateBasket();
});

jQuery.extend(
  jQuery.expr[':'], { 
      Contains : "jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0" 
});

function replaceall(str,search,repl){
  var regEx = new RegExp(search, "ig");
  return str.replace(regEx, repl);
}

function matchall(str,search){
  var regEx = new RegExp(search, "ig");
  return str.match(regEx);
}

function UpdateBasket(){
  $.get("/WebGetBasketQty.hal",function(data){
    let js = JSON.parse(data);
    $(".catalog_basket").html("<div class='basket_cnt'>" + js.basket + "</div>").click(function(){
      location.href = "/katalogs/grozs";
    });
    $(".catalog_fav").html("<div class='basket_cnt'>" + js.fav + "</div>").click(function(){
      location.href = "/katalogs/favoriti";
    });
  });

}


var producttemplate = "<div class='catalog_item'>";
producttemplate += "<div class='item_image'><img></div>";
producttemplate += "<div class='item_details'>";
producttemplate += "<div class='item_name'></div>";
producttemplate += "<div class='item_district'></div>";
producttemplate += "<div class='item_smu'></div>";
producttemplate += "<div class='item_price'></div>";
producttemplate += "<div class='item_like'></div>";
producttemplate += "<div class='item_basket'></div>";
producttemplate += "</div>";
producttemplate += "</div>";

var smutemplate = "<div class='catalog_item'>";
smutemplate += "<div class='item_image'><img></div>";
smutemplate += "<div class='item_details'>";
smutemplate += "<div class='item_smuname'></div>";
smutemplate += "<div class='item_district'></div>";
smutemplate += "</div>";
smutemplate += "</div>";

function DistrictSearch(el,app){
  this.origval = "";
  this.el = el;
  this.app = app;

  this.Init = function(){
    var self = this;
    $(this.el).blur(function(ev){
      setTimeout(function(){
        if (self.droplist){
          self.CloseSearch();
        }
      },500);
    });
    $(this.el).keyup(function(){

      var d = new Date();
      var filter = $(this).val();
      if (self.origval==""){
        self.droplist = $("<div class='district_search_help'></div>");
        $(".district_line").each(function(){
          let district = this;
          let str = $(this).find(".district_name").html();
          if (matchall(str,filter)) {
            let line = $("<div class='searchline'><div class='searchtext' orig='" + str + "'>" + replaceall(str,filter,"<div class='highlight'>$&</div>") + "</div></div>");
            (function(tline,el,tdistrict){
              $(tline).click(function(){
                if ($(tdistrict).find("input").is(":checked")){
                  $(tdistrict).find("input").prop("checked",false).change();
                } else {
                  $(tdistrict).find("input").prop("checked",true).change();
                }
                self.CloseSearch();

              });
            })(line,this,district);
            $(self.droplist).append(line);
          }
        });
        $(".smu_shop_filter_search_ext").append(self.droplist).append("<div class='close_search'></div>");
        $(".smu_shop_filter_search_ext .close_search").click(function(){
          self.CloseSearch();
        })
      } else {
        if (filter!="") {
          //filter exiting filter list
          $(".searchline").each(function(){
            var text = $(this).find(".searchtext");
            if (matchall($(text).attr("orig"),filter)){
              $(text).html(replaceall($(text).attr("orig"),filter,"<div class='highlight'>$&</div>"));
              $(this).slideDown();
            } else {
              $(this).slideUp();
            }
          })
        } else {
          $(self.droplist).remove();
        }
      }
      self.origval = filter;
    });
  }

  this.CloseSearch = function(){
    $(this.droplist).remove();
    $(this.el).val("");
    $(this.el).parent().find(".close_search").remove();
    this.origval = "";
  }

  this.Init();
}

function MainSearch(el,app){
  this.el = el;
  this.app = app;
  this.wait = false;
  this.dosearchf = false;
  this.origval = "";

  this.CheckInterval = function(){
    var self = this;
    var d = new Date();
    var t = d.getTime();
    if (this.dosearchf){
      if (t-this.lasttick>500 || self.origval!=""){
        this.dosearchf = false;
        this.DoSearch();
      }
    }
    setTimeout(function(){self.CheckInterval()},500);
  }

  this.DoSearch = function(){
    var self = this;
    let filter = $(this.el).val();
    if (this.wait==false){
      if (self.origval==""){
        let path = "";
        if (self.app.activetile==kTileProducts){
          path = "/WebLoadSMUProductList.hal";
        } else {
          path = "/WebLoadSMUList.hal";
        }
        let searchstr = "?mainsearch=" + filter;
        searchstr += "&eventnr=" + $(".filter_data").attr("filter");
        searchstr +="&perpage=10";
        this.wait = true;

        self.app.SearchCatalog(0);
        $.get(path + searchstr,function(data){
          let list = JSON.parse(data);
          self.wait = false;
          self.droplist = $("<div class='main_search_help'></div>");
          for (let item of list.list) {
            let str = "";
            if (self.app.activetile==kTileProducts){
              str = item.itemname;
            } else {
              str = item.smfname;
            }
            let line = $("<div class='searchline'><div class='search_logo'><img src='" + item.logo + "'></div><div class='searchtext' orig='" + str + "'>" + replaceall(str,filter,"<div class='highlight'>$&</div>") + "</div></div>");
            $(self.droplist).append(line);
            (function(tline,tstr){
              $(tline).click(function(){
                $(self.el).val(tstr);
                self.app.SearchCatalog(0);
                self.CloseSearch();
              })
            })(line,str)
            
          }
          $(".smu_shop_mainsearch").append(self.droplist).append("<div class='close_search'></div>");
          $(".smu_shop_mainsearch .close_search").click(function(){
            $(self.el).val("").change();
            self.CloseSearch();
          });

        });
      } else {
        if (filter!="") {
          //filter exiting filter list
          $(".searchline .searchtext").each(function(){
            if (matchall($(this).attr("orig"),filter)) {
              $(this).html(replaceall($(this).attr("orig"),filter,"<div class='highlight'>$&</div>"));
              $(this).parent().slideDown();
            } else {
              $(this).parent().slideUp();
            }
          })
        } else {
          $(self.droplist).remove();
        }
        self.app.SearchCatalog(0);
      }
    }
    self.origval = filter;

  }
  this.CloseSearch = function(){
    $(self.droplist).remove();
    $(this.el).parent().find(".close_search").remove();
    $(".main_search_help").remove();
  }

  this.Init = function(){
    var self = this;
    $(this.el).keyup(function(){
      var d = new Date();
      self.lasttick = d.getTime();
      self.dosearchf = true;
    });
    setTimeout(function(){self.CheckInterval()},200);
  }
  this.Init();
}

function ShopApp(){
  this.activetile = kTileProducts;
  this.activepage = 0;
  this.perpage = 48;
  this.displaypgages = 5;
  this.districtsearch = $(".smu_shop_filter_search_ext input");
  this.mainsearch = $(".smu_shop_mainsearch input");
  this.districtlist = $(".district_line input");
  this.industrylist = $(".industry_line input");
  this.selecteddistricts = [];
  this.selectedindustries = [];
  this.pagenav = $("#pagenave");
  this.container = $(".smu_shoplist");
  

  this.Init = function(){
    let self = this;
    $(this.districtsearch).change(function(){
      self.SearchCatalog(0);
    });
    $(".smu_shop_filter_districtlist .district_line:gt(8)").hide();
    $(".smu_shop_districtlist_expand").html($(".smu_shop_districtlist_expand").attr("t1")).click(function(){
      if ($(this).html()==$(this).attr("t1")) {
        $(".smu_shop_filter_districtlist .district_line:gt(8)").show();
        $(this).html($(this).attr("t2"));
      } else {
        $(".smu_shop_filter_districtlist .district_line:gt(8)").hide();
        $(this).html($(this).attr("t1"));
      }
    });
    let ds = new DistrictSearch(this.districtsearch,this);
    $(this.mainsearch).change(function(){
      self.SearchCatalog(0);
    });
    let ms = new MainSearch(this.mainsearch,this);
    $(this.districtlist).change(function(){
      self.UpdateDistrictList();
      self.SearchCatalog(0);
    });
    $(this.industrylist).change(function(){
      self.UpdateIndustryList();
      self.SearchCatalog(0);
    });
    $(".smu_type_filter_button").click(function(){
      $(".smu_type_filter_button.active").removeClass("active");
      $(this).addClass("active");
      let tag = $(this).attr("tag");
      let ntile = kTileProducts;
      let search = $(".smu_shop_mainsearch input");
      switch (tag){
        case "products":
          ntile = kTileProducts;
          search.attr("placeholder",search.attr("p1"));
          break;
        default:
          ntile = kTileSMUs;
          search.attr("placeholder",search.attr("p2"));
      }
      if (ntile!=self.activetile) {
        self.activetile = ntile;
        self.SearchCatalog(0);
      }
    });
    $(".smu_type_filter_button[tag='products']").addClass("active");
    this.SearchCatalog(0,true);
  }

  this.addCloseButton = function(el){
    var self = this;
    let text = $(el).html();
    $(el).append("<div class='close'></div>");
    $(el).find(".close").click(function(){
      let cls = ".industry_line .industry_name";
      if ($(el).hasClass("district")){
        cls = ".district_line .district_name";
      }
      $(cls).each(function(){
        if (matchall($(this).html(),text)) {
          console.log("inside");
          $(this).parent().find("input").prop("checked",false).change();

        }
      })
    });
}

  this.UpdateFilterIcons = function(){
    var self = this;
    let foundf = false;
    $(".filter_data").html("");
    for (let item of this.selecteddistricts){
      $(".filter_data").append("<div class='filter_item district'>" + item + "</div>");
    }
    for (let item of this.selectedindustries){
      $(".filter_data").append("<div class='filter_item'>" + item + "</div>");
    }
    $(".filter_item").each(function(){
      self.addCloseButton(this);
      foundf = true;
    });
    if (foundf) {
      let txt = $(".filter_data").attr("text");
      let remfilter = $("<div class='rem_filter'>" + txt + "</div>");
      $(remfilter).click(function(){
        let last = {};
        $(self.districtlist).each(function(){
          $(this).prop("checked",false);
          last = this;
        })
        $(last).change();
        $(self.industrylist).each(function(){
          $(this).prop("checked",false);
          last = this;
        })
        $(last).change();
      });
      if ($(".rem_filter").length==0){
        $(remfilter).insertAfter(".smu_shop_filter_title");
      }
      $(".filter_data").append($(remfilter).clone(true));
    } else {
      $(".rem_filter").remove();
    }
  }

  this.UpdateDistrictList = function(){
    let tarr = [];
    $(this.districtlist).filter(":checked").each(function(){
      tarr.push($(this).attr("val"));
    })
    this.selecteddistricts = tarr;
    this.UpdateFilterIcons();
  }

  this.UpdateIndustryList = function(){
    let tarr = [];
    $(this.industrylist).filter(":checked").each(function(){
      tarr.push($(this).attr("val"));
    })
    this.selectedindustries = tarr;
    this.UpdateFilterIcons();
  }

  this.ShowLoading = function(){

  }

  this.SearchCatalog = function(page,initf=false){
    let self = this;
    this.activepage = page;
    this.ShowLoading();
    let path = "/WebLoadSMUProductList.hal";
    if (this.activetile==kTileSMUs){
      path = "/WebLoadSMUList.hal";
    }
    let searchstr = "?page=" + page + "&perpage=" + this.perpage;
    searchstr += "&industry=" + this.selectedindustries.join("|");
    searchstr += "&district=" + this.selecteddistricts.join("|");
    searchstr += "&mainsearch=" + this.mainsearch.val();
    searchstr += "&eventnr=" + $(".filter_data").attr("filter");
    
    $.get(path + searchstr,function(data){
      let list = JSON.parse(data);
      self.totalpages = parseInt(list.totalitems/self.perpage)+1;
      self.ShowCatalog(list.list);
      self.UpdatePagination();
      if (!initf){
        $([document.documentElement, document.body]).animate({
          scrollTop: $(".smu_shop_type_filter").offset().top-80
        }, 500);
      }
    });

  }
  this.trimItemName = function(tstr) {
    let res = tstr;
    if (tstr.length>47) {
      res = tstr.substr(0,47) + "...";
    }

    return res;
  }

  this.ShowCatalog = function(list){
    var self = this;
    $(this.container).html("");
    for (let item of list) {
      let cont = {};
      switch (this.activetile){
        case kTileProducts:
          cont = $(producttemplate);
          $(cont).find(".item_smu").html(item.smfname);
          $(cont).find(".item_name").html(self.trimItemName(item.itemname) + "<div class='item_name_hover'>" + item.itemname + "</div>");
          $(cont).find(".item_price").html(item.price + " EUR");
          $(cont).find(".item_district").html(item.district);
          $(cont).find(".item_image img").attr("src",item.logo);
          if (item.tag!=""){
            $(cont).append("<div class='item_tag " + item.tagcolor + "'>" + item.tag + "</div>");
          }
          $(cont).click(function(){
            window.open(item.shopurl, '_blank'); 
          });
          if (item.liked==1){
            $(cont).find(".item_like").addClass("active");
          }
          if (item.addedtobasket==1){
            $(cont).find(".item_basket").addClass("added_to_basket");
          }
          $(cont).find(".item_like").attr("uuid",item.uuid).click(function(e){
            uuid = $(this).attr("uuid");
            e.stopPropagation();
            $.get("/WebUpdateSMUProductLike.hal?uuid=" + uuid,function(){
              UpdateBasket();
            });
            $(this).toggleClass("active");
          });
          $(cont).find(".item_basket").attr("uuid",item.uuid).click(function(e){
            uuid = $(this).attr("uuid");
            e.stopPropagation();
            $.get("/WebUpdateSMUProductLike.hal?type=basket&uuid=" + uuid,function(){
              UpdateBasket();
            });
            $(this).toggleClass("added_to_basket");
          });
          break;
        case kTileSMUs:
          cont = $(smutemplate);
          $(cont).find(".item_smuname").html(item.smfname);
          $(cont).find(".item_district").html(item.district);
          $(cont).find(".item_image img").attr("src",item.logo);
          $(cont).click(function(){
            window.open(item.shopurl, '_blank'); 
          });
  
      }
      $(this.container).append(cont);
    }
  }

  this.AddPage = function(i,text,activef,clickf){
    var self = this;
    var pg = $("<div class='page'>" + text + "</div>");
    if (activef){
      $(pg).addClass("active");
    };
    if (clickf) {
      pg.click(function(){
        self.SearchCatalog(i);
      })
    }
    $(this.pagenav).append(pg);
  }


  this.UpdatePagination = function(){
    let self = this;
    this.pagenav.html("");
    if (this.totalpages>1) {
      let spos = this.activepage-3;
      let epos = this.activepage+3;
      this.AddPage(0,"<",false,true);
      if (spos<=0) {
        spos = 0;
      } else {
        this.AddPage(0,"..",false,false);
      }
      if (epos>=(this.totalpages-1)) {
        epos = this.totalpages-1;
      }
    
      for (let i=spos;i<=epos;i++){
        this.AddPage(i,i+1,i==this.activepage,i!=this.activepage);
      }
      if (epos<(this.totalpages-1)){
        this.AddPage(this.totalpages-1,"..",false,false);
        this.AddPage(this.totalpages-1,this.totalpages,false,true);

      }
      this.AddPage(this.totalpages-1,">",true,true);
    }
  }
  this.Init();
}