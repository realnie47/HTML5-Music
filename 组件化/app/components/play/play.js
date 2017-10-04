import './play.css'
import {searchArtist,getMusic,index} from '../../http.js'

class Player {
  constructor() {
    let player = document.createElement('div');
    player.classList.add('app-container');
    player.innerHTML = `
    <div class="player" id="musicPlayer">
    <div class="album-pic"></div>
    <div class="info">
        <div class="info-title"></div>
        <div class="info-songer"></div>
    </div>
    <div class="controls">
        <div class="list"><i class="fa fa-th-list"></i></div>
        <div class="previous">
            <i class="fa fa-step-backward"></i>
        </div>
        <div class="play">
            <i class="fa fa-pause-circle"></i>
        </div>
        <div class="next">
            <i class="fa fa-step-forward"></i>
        </div>
        <div class="lrc"><i class="fa fa-file-text-o"></i></div>
        <div class="commentBtn" title="关闭评论"><i class="fa fa-commenting-o"></i></div>
    </div>
    <audio id="audio">  
    </audio>
</div>
    `;
    return player;
  }
  // 播放音乐
  static beginPlay() {
    $('#audio')[0].play();
  }
  // 暂停音乐
  static pausePlay() {
    $('#audio')[0].pause();
  }

  // 功能
  static option() {
    // 播放按钮
    $(".play").click(function() {
      // 如果音频状态为暂停，则播放，如果不是暂停，则暂停
      if ( $('#audio')[0].paused) {
        Player.beginPlay();
      } else {
        Player.pausePlay();
      }
    });
    // 下一曲按钮
    $('.next').click(function() {
      console.log(index);
      index++;
      // getMusic();
    })
    


  }
}

export default Player