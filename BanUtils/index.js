let banlist = {};
let me = MPP.client.user;
let chat = MPP.chat;
let anonban = false;
let grant = {};

let permabanlist = {"840409e6fcf49c3fa9bde525": true};
let permaban = true;

let delay = 0;
window.onload = () => {
    refreshPermaban();
}
MPP.client.on('a', (data) => {
    let msg = data.a;
    let id = data.p._id;
    let args = msg.split(' ');
    let cmd = args.shift();
    handleCommand(id, cmd, args);
});
MPP.client.on('participant update', (p) => {
    let id = p._id;
    if (typeof banlist[id] !== 'undefined') {
        ban(id);
    }
    if (anonban && p.name === 'Anonymous') {
        ban(id);
    }
    if (permaban && typeof permabanlist[id] !== 'undefined') {
        ban(id)
    }
});

function handleCommand(id, cmd, args) {
    if (canUseCommand(id)) {
        if (cmd === '/ban') {
            if (typeof args[0] === 'undefined') {
                chat.send('추방할 유저의 id를 입력해주세요');
                return;
            }
            if (canUseCommand(args[0]) && !isAdmin(id)) {
                chat.send('소유자가 아닌 유저는 소유자 또는 다른 관리자를 추방할 수 없습니다.');
                return;
            }
            chat.send('사용자 아이디 ' + args[0] + ' (이)가 차단되었습니다.');
            ban(args[0]);
        } else if (cmd === '/pardon') {
            if (typeof args[0] === 'undefined') {
                chat.send('차단 해제할 유저의 id를 입력해주세요');
                return;
            }
            if (typeof banlist[args[0]] !== 'undefined') {
                delete banlist[args[0]];
                chat.send('차단 해제가 완료되었습니다.');
            } else {
                chat.send('잘못된 아이디입니다. 아이디를 확인하신 후 다시 시도해주세요.');
            }
        } else if (cmd === '/banlist') {
            let txt = '금지된 유저 목록: ';
            for (let banned in banlist) {
                txt += banned + ' ';
            }
            chat.send(txt);
        }
    }
    if (isAdmin(id)) {
        if (cmd === '/grant') {
            if (typeof args[0] === 'undefined') {
                chat.send('권한을 부여할 유저의 id를 입력해주세요');
                return;
            }
            if (typeof grant[args[0]] === 'undefined') {
                grant[args[0]] = true;
                chat.send("관리자 권한이 부여되었습니다: " + args[0]);
            } else {
                delete grant[args[0]];
                chat.send('관리자 권한이 박탈되었습니다: ' + args[0]);
            }
        }
        if (cmd === '/grantlist') {
            let txt = '관리자 유저 목록: ';
            for (let granted in grant) {
                txt += granted + ' ';
            }
            chat.send(txt);
        }
        if (cmd === '/anonban') {
            if (anonban) {
                chat.send('익명 닉네임(Anonymous) 금지를 해제합니다.');
                anonban = false;
            } else {
                chat.send('익명 닉네임(Anonymous)을 금지합니다.');
                anonban = true;
            }
        }
    }
    if (cmd === '/list') {
        let names = $('.nametext');
        let list = '';
        for (let n in names) {
            let element = names[n];
            let id = element.id;
            if (typeof id === 'undefined') continue;
            let name = element.innerText;
            list += name + '(' + id.substring(9) + ') ';
        }
        chat.send(list);
    }
    if (cmd === '/delay') {
        if (typeof args[0] === 'undefined' || parseInt(args[0]) < 0) {
            chat.send('밴 딜레이를 올바른 정수로 입력해주세요');
            return
        }
        delay = parseInt(args[0])
        chat.send('밴 딜레이가 ' + args[0] + '(으)로 설정되었습니다.');
    }

    if (cmd === '/permaban') {
        if (!permaban) {
            chat.send('리스트에 등록된 유저를 영구적으로 추방하도록 설정합니다.');
            permaban = true;
        } else {
            chat.send('영구 추방이 해제되었습니다.');
            permaban = false;
        }
    }
}

function isAdmin(id) {
    return id === me._id && MPP.client.isOwner();
}

function canUseCommand(id) {
    return (id === me._id && MPP.client.isOwner()) || typeof (grant[id]) !== 'undefined';
}

function ban(id) {
    banlist[id] = true;
    MPP.client.sendArray([
        {
            m: 'kickban',
            _id: id,
            ms: delay,
        },
    ]);
}
