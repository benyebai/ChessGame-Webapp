export function convertSeconds(secondsaa){
    let minutes = Math.floor(secondsaa / 60).toString();
    let seconds = (secondsaa % 60).toString();

    if(minutes.length == 1) minutes = minutes;
    if(seconds.length == 1) seconds = "0" + seconds;

    return (minutes + ":" + seconds);
}   
