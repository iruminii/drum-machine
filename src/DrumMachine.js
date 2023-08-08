import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faVolumeOff, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown, } from '@fortawesome/free-brands-svg-icons'
import { useState, useRef, useEffect, useCallback } from 'react';

function Controls({audioName, handleBank, bankCheck, handlePower, powerCheck, volumeValue, handleVolume}) {

    return (
        <>
            <div className='power-border'>
                <div className={"power-btn" + (powerCheck ? " btn-on" : " btn-off")}>
                    <input type='checkbox' className='power-checkbox' onClick={handlePower} checked={powerCheck}/>
                </div>
            </div>
            <div className='bank-border'>
                <div className={'bank-toggle' + (powerCheck ? ' bank-on' : '')}>
                    Bank
                    <input type='checkbox' className='bank-checkbox' checked={bankCheck}/>
                    <span className='toggle-wrapper'>
                        <span className='bank-knob' onClick={handleBank}></span>
                    </span>
                </div>
            </div>
            <div className='display'>
                <span className={'display-text' + (((audioName === 'bye bye') || (audioName === 'hello')) ? ' turn-off' : '')}  key={Math.random()}>{audioName}</span>
            </div>
            <div className='volume'>
                <FontAwesomeIcon icon={faVolumeOff} className={'vol-icons icon-bottom' + (powerCheck ? ' icon-on' : ' icon-off')}/>
                <input className='vol-slider' type='range' orient="vertical" id="vol" 
                value={volumeValue} autoComplete='off' max={1} step={0.01} min={0} 
                onChange={(e, t) => { handleVolume(e.target.value)}}></input>
                <FontAwesomeIcon icon={faVolumeHigh} className={'vol-icons icon-top' + (powerCheck ? ' icon-on' : ' icon-off')}/>
            </div>
        </>
    )
}

function DrumPads({indexVal, audioNames, padKeys, audioSrcs, powerCheck, onPadClick, volumeVal}) {

    const aref = useRef();
    const pref = useRef(null);

    const handleKeyDown = (event) => {
        if(event.key === padKeys.toLowerCase() && powerCheck) {
            if(aref.current === undefined) {
                return;
            }
                onPadClick(9);
                pref.current.blur();
                pref.current.focus();
            }
    }

    const handleKeyPress = (event) => {
        if(event.key === padKeys.toLowerCase() && powerCheck) {
            if(aref.current === undefined) {
                return;
            }
            
            if(aref.current.duration > 0) {
                aref.current.currentTime = 0;
            }
            pref.current.click();
            pref.current.focus();
            onPadClick(indexVal);
            aref.current.volume = volumeVal;
            aref.current.play();
            }
    }

    useEffect(() => {
        window.addEventListener("keyup", handleKeyPress);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
                        window.removeEventListener("keyup", handleKeyPress);
                        window.removeEventListener("keydown", handleKeyDown);
                    }
    }, [audioNames, indexVal, audioSrcs, padKeys, powerCheck, volumeVal]);

    function handleMouseDown() {
        if(aref.current === undefined) {
            return;
        }
        if(aref.current.duration > 0) {
            aref.current.currentTime = 0;
        }
    }

    function handleClick(i) {
        if(aref.current === undefined) {
            return;
        }
        onPadClick(i);
        aref.current.volume = volumeVal;
        aref.current.play();
    }

    return (
            <div ref={pref} tabIndex={0} key={`${padKeys}-${indexVal}`} className={'drum-pad-border' + (powerCheck ? ' border-on' : ' border-off')} onMouseDown={ powerCheck ? (() => handleClick(9)) : null} onClick={ powerCheck ? (() => handleClick(indexVal)) : null}  onKeyUp={ powerCheck ? ((event) => handleKeyPress(event)) : null}  >
                <div className='drum-pad' id={audioNames} key={`${padKeys}-pad`}>
                    {padKeys}
                    <audio key={`${padKeys}-audio`} ref={aref} className='clip' id={padKeys} src={audioSrcs} />
                </div>
            </div>   
    )
}

export default function DrumMachine() {
    let keys = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];
    let names1 = ["Heater 1", "Heater 2", "Heater 3", "Heater 4",
                    "Clap", "Open-HH", "Kick-n'-Hat", "Kick", "Closed-HH"];

    let sources1 = ["https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3", 
                    "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"];  

    let names2 = ["Chord 1", "Chord 2", "Chord 3", "Shaker", 
                  "Open HH", "Closed HH", "Punchy Kick", "Side Stick", "Snare"];

    let sources2 = ["https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3",
                    "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"];

    let [bankIsChecked, setBankIsChecked] = useState(false);
    let [powerIsOn, setPowerIsOn] = useState(true);
    let [displayText, setDisplayText] = useState("");
    let [volume, setVolume] = useState(0.5);


    function toggleBank() {
        setDisplayText(powerIsOn ? (bankIsChecked ? 'Heater Kit' : 'Smooth Piano Kit') : '' );
        setBankIsChecked(!bankIsChecked);
    }

    function togglePower() {
        setDisplayText(powerIsOn ? `bye bye` : `hello`);
        setPowerIsOn(!powerIsOn);
    }

    function handlePad(i) {
        setDisplayText((i === 9) ? '' : bankIsChecked ? names2[i] : names1[i]);
    }

    function onVolumeChange(i) {
        setVolume(i);
        setDisplayText(powerIsOn ? (`Volume: ${Math.round(i*100)}`) : '');
    }

    return (
    <>
        <div className='drum-machine'>
        <div className='controls'>
            <Controls audioName={displayText} handleBank={toggleBank} bankCheck={bankIsChecked} handlePower={togglePower} powerCheck={powerIsOn} volumeValue={volume} handleVolume={onVolumeChange}/>
        </div>
        <div className='pads'>
            {
                keys.map((pkey, i) => {
                    return (<DrumPads indexVal={i} volumeVal={volume} audioNames={bankIsChecked ? names2[i] : names1[i]} padKeys={pkey} audioSrcs={bankIsChecked ? sources2[i] : sources1[i]} powerCheck={powerIsOn} onPadClick={handlePad}/>)
                })
            }
        </div>        
        </div>
    </>
    )
}