// ============================================
// AUDIO MANAGER - Manages Game Audio
// ============================================

class AudioManager {
    constructor() {
        this.masterVolume = 0.7;
        this.effectsVolume = 0.7;
        this.musicVolume = 0.5;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    /**
     * Set master volume
     */
    setMasterVolume(volume) {
        this.masterVolume = Helpers.clamp(volume, 0, 1);
    }

    /**
     * Set effects volume
     */
    setEffectsVolume(volume) {
        this.effectsVolume = Helpers.clamp(volume, 0, 1);
    }

    /**
     * Set music volume
     */
    setMusicVolume(volume) {
        this.musicVolume = Helpers.clamp(volume, 0, 1);
    }

    /**
     * Play sound effect
     */
    playEffect(soundName) {
        const sound = assetManager.getSound(soundName);
        if (sound) {
            sound.volume = this.masterVolume * this.effectsVolume;
            sound.play();
        }
    }

    /**
     * Play background music
     */
    playMusic(musicName, loop = true) {
        const music = assetManager.getSound(musicName);
        if (music) {
            music.loop = loop;
            music.volume = this.masterVolume * this.musicVolume;
            music.play();
        }
    }

    /**
     * Stop all audio
     */
    stopAll() {
        Object.values(assetManager.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}

const audioManager = new AudioManager();
