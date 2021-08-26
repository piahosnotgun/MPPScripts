let banlist = {};
let me = MPP.client.user;
let chat = MPP.chat;
let anonban = false;

MPP.client.on('a', (data) => {
    let msg = data.a;
    let id = data.p._id;
    let args = msg.split(' ');
    let cmd = args.shift();
    if (id === me._id && MPP.client.isOwner()) {
        if (cmd === '/ban') {
            if (typeof args[0] === 'undefined') {
                chat.send('추방할 유저의 id를 입력해주세요');
                return;
            }
            chat.send('사용자 아이디 ' + args[0] + ' (이)가 차단되었습니다.');
            ban(args[0]);
        }
    } else if (cmd === '/anonban') {
        if (anonban) {
            chat.send('익명 유저 차단이 해제되었습니다.');
        } else {
            chat.send('익명 유저를 차단합니다.');
        }
        anonban = !anonban;
    } else if (cmd === '/pardon') {
        if (typeof args[0] === 'undefined') {
            chat.send('차단 해제할 유저의 id를 입력해주세요');
            return;
        }
        if (typeof banlist[args[0]] !== 'undefined') {
            delete banlist[args[0]];
            chat.send('차단 해제가 완료되었습니다.');
            return;
        } else {
            chat.send('잘못된 아이디입니다. 아이디를 확인하신 후 다시 시도해주세요.');
        }
    } else if (cmd === 'banlist') {
        let txt = '금지된 유저 목록: ';
        for (let banned in banlist) {
            txt += banned + ' ';
        }
        chat.send(txt);
    }
    if (cmd === '/list') {
		let names = $('.nametext');
		let list = "";
		for(let n in names){
			let element = names[n];
			let id = element.id;
			if(typeof id === 'undefined')
				continue;
			let name = element.innerText;
			list += name + "(" + id.substring(9) + ") ";
		}
		chat.send(list);
    }
});
MPP.client.on('participant update', (p) => {
    let id = p._id;
    if (typeof banlist[id] !== 'undefined') {
        ban(id);
    }
    if (anonban && p.name === 'Anonymous') {
        ban(id);
    }
});
function ban(id) {
    banlist[id] = true;
    MPP.client.sendArray([
        {
            m: 'kickban',
            _id: id,
            ms: 0,
        },
    ]);
}