import Search from './components/search/search.js'
import Player from './components/play/play.js'
import './main.css'

var root = document.getElementById('root');

// 搜索框
root.appendChild(new Search());
Search.searchEvent();

// 播放器
root.appendChild(new Player());
Player.option();