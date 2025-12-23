/*
 * Author : Ho-Seok Ee <hsee@korea.ac.kr>
 * Release: 2006/07/14
 * Update : 2011/01/22

 Copyright (C) Ho-Seok Ee <hsee@korea.ac.kr>. All rights reserved.
 
  This program is free software; you can redistribute it and/or
  modify it under the terms of the GNU General Public License as
  published by the Free Software Foundation; either version 2 of
  the License, or (at your option) any later version.
 
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.
 
  The license can be found at http://www.gnu.org/licenses/gpl.txt.
 */

var ohiQ = Array(0,0,0,0,0,0);
var ohiStatus = document.createElement('a');
var ohiTimeout = 0;

function ohiDoubleJamo(a,c,d) {
        var i, a=Array( // Double Jamos
                Array(Array(1,7,18,21,24),1,7,18,21,24), // Cho
                Array(Array(39,44,49),Array(31,32,51),Array(35,36,51),51), // Jung
                Array(Array(1,4,9,18,21),Array(1,21),Array(24,30),Array(1,17,18,21,28,29,30),Array(0,21),21))[a]; // Jong
        for (i=a[0].length; c!=a[0][i-1]; i--) if (!i) return i;
        for (a=a[i], i=a.length||1; 1; i--) if (!i || d==a || d==a[i-1]) return i;
}

function ohiInsert(f,m,c) { // Insert
        if (!c && ohiQ=='0,0,0,0,0,0') return true;
        if (c.length!=6) ohiQ=Array(0,0,0,0,0,0);
        else {
                var m=m||'0,0,0,0,0,0', i=c[0]+c[1], j=c[2]+c[3], k=c[4]+c[5];
                c=i&&j?0xac00+(i-(i<3?1:i<5?2:i<10?4:i<20?11:12))*588+(j-31)*28+k-(k<8?0:k<19?1:k<25?2:3):0x3130+(i||j||k);
        }
        if (document.selection) { // IE
                var s=document.selection.createRange(), t=s.text;
                if (t && document.selection.clear) document.selection.clear();
                s.text=(m=='0,0,0,0,0,0'||c&&t.length>1?'':t)+String.fromCharCode(c);
                if (!c || !m || s.moveStart('character',-1)) s.select();
        }
        else if (f.selectionEnd+1) {
                if (m!='0,0,0,0,0,0' && f.selectionEnd-f.selectionStart==1) f.selectionStart++;
                var e=document.createEvent('KeyboardEvent');
                if (e.initKeyEvent) { // Gecko
                        e.initKeyEvent('keypress',0,0,null,0,0,0,0,127,c);
                        if (c && f.dispatchEvent(e) && m) f.selectionStart--;
                } else { // Chrome
                        var scrollTop = f.scrollTop, scrollLeft = f.scrollLeft, selectionStart = f.selectionStart;
                        var endText = f.value.substr(f.selectionEnd,f.value.length);
                        f.value = f.value.substr(0,selectionStart)+String.fromCharCode(c);
                        var scrollHeight = f.scrollHeight, scrollWidth = f.scrollWidth;
                        f.value += endText;
                        f.scrollTop = (scrollTop > scrollHeight-f.clientHeight) ? scrollTop : scrollHeight-f.clientHeight;
                        f.scrollLeft = (scrollLeft > scrollWidth-f.clientWidth) ? scrollLeft : scrollWidth-f.clientWidth;
                        f.setSelectionRange(m?selectionStart:selectionStart+1,selectionStart+1);
                }
        }
}

function ohiHangul2(f,c) { // 2-Bulsik
        if (c<65 || (c-1)%32>25) ohiInsert(f,0,c);
        else if ((c=Array(17,48,26,23,7,9,30,39,33,35,31,51,49,44,32,36,18,1,4,21,37,29,24,28,43,27)[c%32-1]
                        +(c==79||c==80?2:c==69||c==81||c==82||c==84||c==87?1:0))<31) { // Jaum
                if ((!ohiQ[5] || !(ohiQ[0]=-1)) && ohiQ[2]) ohiQ[5]=ohiDoubleJamo(2,ohiQ[4],c);
                if (!ohiQ[2] || ohiQ[0]<0 || ohiQ[0] && (!ohiQ[4] || !ohiQ[5]) && (ohiQ[4] || c==8 || c==19 || c==25))
                        ohiInsert(f,(ohiQ=ohiQ[1]||ohiQ[2]||!ohiDoubleJamo(0,ohiQ[0],c)?ohiQ:0),ohiQ=Array(c,ohiQ?0:1,0,0,0,0));
                else if (!ohiQ[0] && (ohiQ[0]=c) || (ohiQ[4]=ohiQ[4]||c)) ohiInsert(f,0,ohiQ);
                if (ohiQ[5]) ohiQ[5]=c;
        }
        else { // Moum
                if ((!ohiQ[3] || ohiQ[4] || !(ohiQ[2]=-1)) && !ohiQ[4]) ohiQ[3]=ohiDoubleJamo(1,ohiQ[2],c);
                if ((ohiQ[0] && ohiQ[2]>0 && ohiQ[4]) && (ohiQ[5] || !(ohiQ[5]=ohiQ[4]) || !(ohiQ[4]=0))) {
                        ohiInsert(f,0,Array(ohiQ[0],ohiQ[1],ohiQ[2],ohiQ[3],ohiQ[4],0));
                        ohiInsert(f,ohiQ,ohiQ=Array(ohiQ[5],0,c,0,0,0));
                }
                else if ((!ohiQ[0] || ohiQ[2]) && (!ohiQ[3] || ohiQ[4]) || ohiQ[2]<0) ohiInsert(f,ohiQ,ohiQ=Array(0,0,c,0,0,0));
                else if (ohiQ[2]=ohiQ[2]||c) ohiInsert(f,0,ohiQ);
        }
}

function ohiHangul3(f,c) { // 3-Bulsik
        c=Array(2,183,24,15,14,8220,120,39,126,8221,43,44,41,46,74,119,30,22,18,78,83,68,73,85,79,52,110,44,62,46,33,10,
                /*A~*/7,63,27,12,5,11,69,48,55,49,50,51,34,45,56,57,29,16,6,13,54,3,28,20,53,26,40,58,60,61,59,42,23,79,
                /*a~*/71,86,72,66,84,96,109,115,93,116,122,113,118,121,21,67,4,70,99,74,9,1,101,17,37,92,47,8251)[c-33];
        if (c>92 && c<123) { // Cho
                ohiInsert(f,(ohiQ=ohiQ[1]||ohiQ[2]||!ohiDoubleJamo(0,ohiQ[0],c-92)?ohiQ:0),ohiQ=Array(c-92,ohiQ?0:1,0,0,0,0));
        }
        else if (c>65 && c<87) { // Jung
                if (!ohiQ[3] || !(ohiQ[2]=-1)) ohiQ[3]=ohiDoubleJamo(1,ohiQ[2],c-35);
                if ((!ohiQ[0] || ohiQ[2]) && (!ohiQ[3] || ohiQ[4]) || ohiQ[2]<0) ohiInsert(f,ohiQ,ohiQ=Array(0,0,c-35,0,0,0));
                else if (ohiQ[2]=ohiQ[2]||c-35) ohiInsert(f,0,ohiQ);
        }
        else if (c<31) { // Jong
                if (!ohiQ[5] || !(ohiQ[4]=-1)) ohiQ[5]=ohiDoubleJamo(2,ohiQ[4],c);
                if (!ohiQ[0] || !ohiQ[2] || ohiQ[4] && !ohiQ[5] || ohiQ[4]<0) ohiInsert(f,ohiQ,ohiQ=Array(0,0,0,0,c,0));
                else if (ohiQ[4]=ohiQ[4]||c) ohiInsert(f,0,ohiQ);
        }
        else ohiInsert(f,0,c);
}

function ohiKeypress(e) {
        var e=e||window.event, f=e.target||e.srcElement, n=f.nodeName||f.tagName, c=e.which||e.which==0?e.which:e.keyCode;
        var i=0, kbd=ohiStatus.innerHTML.substr(3), swaped=Array();
        if (kbd=='QWERTZ') swaped=Array(89,90,90,89,121,122,122,121);
        if (kbd=='AZERTY') swaped=Array(65,81,81,65,87,90,90,87,97,113,113,97,119,122,122,119,77,58,109,59,44,109,58,46,59,44);
        if (f.type=='text' && n=='INPUT' || n=='TEXTAREA') {
                if ((c==10 || c==13 || c==32) && ohiInsert(f,0,0) && (e.ctrlKey || e.shiftKey)) { // Toggle
                        if ((c==10 || c==13) && e.ctrlKey) ohiStart('KBD');
                        else ohiStart((e.ctrlKey?'Ko':'K3')+ohiStatus.innerHTML.substr(2));
                        if (e.preventDefault) e.preventDefault();
                        return false;
                }
                if (ohiStatus.innerHTML.substr(0,2)!='En' && c>32 && c<127 && e.keyCode<127 && !e.altKey && !e.ctrlKey) {
                        if (c>64 && c<91 && !e.shiftKey) c+=32;
                        if (c>96 && c<123 && e.shiftKey) c-=32;
                        if (document.selection && document.selection.createRange().text.length!=1) ohiQ=Array(0,0,0,0,0,0);
                        if (f.selectionEnd+1 && f.selectionEnd-f.selectionStart!=1) ohiQ=Array(0,0,0,0,0,0);
                        while (swaped[i] && swaped[i]!=c) i+=2;
                        if (i!=swaped.length) c=swaped[i+1];
                        if (ohiStatus.innerHTML.substr(0,2)=='Ko') ohiHangul2(f,c);
                        if (ohiStatus.innerHTML.substr(0,2)=='K3') ohiHangul2(f,c);
                        if (e.preventDefault) e.preventDefault();
                        return false;
                }
        }
}

function ohiKeydown(e) {
        var e=e||window.event, f=e.target||e.srcElement, n=f.nodeName||f.tagName;
        if (f.type=='text' && n=='INPUT' || n=='TEXTAREA') {
                if (e.keyCode==8 && (ohiQ[1] || ohiQ[3] || ohiQ[0] && ohiQ[2])) { // Backspace
                        for (var i=5; !ohiQ[i];) i--;
                        ohiInsert(f,ohiQ[i]=0,ohiQ);
                        if (e.preventDefault) e.preventDefault();
                        return false;
                }
                if (e.keyCode==8 && ohiQ[0]) ohiQ[0]=0;
                if (e.keyCode!=16 && e.keyCode<47) ohiInsert(f,0,0);
                if (e.keyCode==27) f.blur(); // Esc
        }
}

function ohiStart(l) {
        if (typeof(l)=='string') {
                var kbd=ohiStatus.innerHTML.substr(2);
                if (l=='KBD') ohiStatus.innerHTML = ohiStatus.innerHTML.substr(0,2)+(!kbd?':QWERTZ':kbd==':QWERTZ'?':AZERTY':'');
                else ohiStatus.innerHTML = ((l=='En'||l==ohiStatus.innerHTML)?'En':l.substr(0,2))+kbd;
        }
        if (document.body) {
                if (document.all) {
                        ohiStatus.style.position = 'absolute';
                        ohiStatus.style.right = -(document.body.scrollLeft||document.documentElement.scrollLeft)+'px';
                        ohiStatus.style.bottom = -(document.body.scrollTop||document.documentElement.scrollTop)+'px';
                        if (ohiTimeout) clearTimeout(ohiTimeout);
                        ohiTimeout = setTimeout("ohiStart()",100);
                }
                if (document.body!=ohiStatus.parentNode) {
                        if (!ohiStatus.style.position) {
                                ohiStatus.style.position = 'fixed';
                                ohiStatus.style.right = '0px';
                                ohiStatus.style.bottom = '0px';
                        }
                        ohiStatus.target = '_blank';
                        ohiStatus.href = 'http://ohi.kr/';
                        ohiStatus.style.fontFamily = 'GulimChe,monospace';
                        ohiStatus.style.fontWeight = 'normal';
                        ohiStatus.style.color = 'white';
                        ohiStatus.style.backgroundColor = 'royalblue';
                        ohiStatus.style.fontSize = '10pt';
                        ohiStatus.style.lineHeight = '10pt';
                        ohiStatus.style.zIndex = '255';
                        document.body.appendChild(ohiStatus);
                        if (document.addEventListener) {
                                document.addEventListener('keypress', ohiKeypress, true);
                                document.addEventListener('keydown', ohiKeydown, true);
                        } else {
                                document.onkeypress = ohiKeypress;
                                document.onkeydown = ohiKeydown;
                        }
                }
        }
        else ohiTimeout = setTimeout("ohiStart()",100);
}

ohiStart('En');
