/* inspried by https://stackoverflow.com/questions/2026335/how-to-add-extra-info-to-copied-web-text */
document.addEventListener('copy', function (e) {
  let selection = window.getSelection();
  let selected_content = selection.toString();
  let min_len = 64;
  let mid_len = 128;
  let max_len = 256;
  let seg_num = 2;
  let basic = true;
  let info_head = "\n\nRead more: ";
  let info_tail = "\n";

  if (selected_content.length >= min_len) {
    let current_url = document.location.href;
    let host = location.hostname;
    //let source_info = "<pre><br />Read more: Copyright &copy; <a href='" + current_url + "' target='_blank'>" + host + "</a><br /></pre>";
    //let source_info = "\n\nRead more: <a href='" + current_url + "' target='_blank'>" + host + "</a>\n\n";
    let source_info = info_head + host + info_tail;
    let new_content = "";

    if (selected_content.length <= mid_len || basic === true) {
      new_content = selected_content + source_info;
    } else {
      let content = "";
      if (selected_content.length > max_len) {
        content = selected_content.slice(0, max_len - 1);
      } else {
        content = selected_content;
      }

      let seg_len = Math.floor(content.length / seg_num);
      let segments = [];

      for (let i = 0; i < seg_num; i += 1) {
        if (i === (seg_num - 1)) {
          segments.push(content.slice(i * seg_len, content.length));
        } else {
          segments.push(content.slice(i * seg_len, (i + 1) * seg_len));
        }
      }

      segments.forEach(function (item) {
        new_content += (item + source_info);
      });
    }

    let body_element = document.getElementsByTagName('body')[0];
    let select_range = document.createRange();
    let new_div = document.createElement('div');
    new_div.style.position = 'absolute';
    new_div.style.left = '-99999px';
    new_div.innerText = new_content;
    body_element.appendChild(new_div);

    /* inspired by https://github.com/tovic/sticky-attribution */
    select_range.selectNodeContents(new_div);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(select_range);

    window.setTimeout(function () {
      body_element.removeChild(new_div);
    }, 200);

    //console.log(new_content);
  } else {
    return;
  }
});
