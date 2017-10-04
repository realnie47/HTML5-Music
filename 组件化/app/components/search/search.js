import './search.css'
import {searchArtist} from '../../http.js'

class Search {
  constructor() {
    let search = document.createElement('div');
    search.innerHTML = `
      <input type="text" id="search" value="金玟岐" autocomplete="off"> 
      <i class="fa fa-search"></i>
    `
    search.classList.add('searchDiv');
    return search;
  }

  static searchEvent() {
    // 如果输入回车则开始搜索
    $('#search').keyup(function(e) {
      if(e.keyCode == 13 ){
        searchArtist($('#search').val());
      }
    })
  }

  
} 


export default Search