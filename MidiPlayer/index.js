loadParser().then(()=>{
	let parser = MidiParser;
});
async function loadParser(){
	let res = await fetch('https://colxi.info/midi-parser-js/src/main.js');
	let text = await res.text;
	eval(text);
}