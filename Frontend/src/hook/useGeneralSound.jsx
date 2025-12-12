import useSound from "use-sound";

export const useGeneralSound = (filePath, volume = 0.5) => {
    const [play, { stop, pause, sound }] = useSound(filePath, {
        volume: volume,
        interrupt: true,    
    })

    return {
        play,
        stop,
        pause,
        sound,
    };
};

