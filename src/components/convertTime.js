export function convertSeconds(secondsaa){
    let minutes = (Math.floor(secondsaa / 60) % 60).toString();
    let seconds = (secondsaa % 60).toString();
    let hours = Math.floor(secondsaa / 3600);
    if(hours > 0) hours = "0" + hours.toString() + ":";
    else hours = "";

    if(minutes.length == 1) minutes = "0" + minutes;
    if(seconds.length == 1) seconds = "0" + seconds;

    return (hours + minutes + ":" + seconds);
}   
