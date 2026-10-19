/*
Student Name: Your Name
File Name: script.js
Date: October 18, 2026
*/

function hamburger() {
    var menu = document.getElementById("menu-links");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

/*
 * Plays short, original musical note patterns using the browser's Web Audio API.
 * No external audio files or downloads are required.
 */
var activeAudioContext = null;
var activeAudioButton = null;

function playSample(instrument, button) {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        alert("Audio playback is not supported by this browser. Please try a recent version of Chrome, Edge, Firefox, or Safari.");
        return;
    }

    if (activeAudioContext) {
        try {
            activeAudioContext.close();
        } catch (error) {
            // Ignore a context that has already closed.
        }
        activeAudioContext = null;
    }

    if (activeAudioButton) {
        activeAudioButton.textContent = activeAudioButton.getAttribute("data-label") || "▶ Play sample";
        activeAudioButton.disabled = false;
    }

    var context = new AudioContextClass();
    activeAudioContext = context;
    activeAudioButton = button;

    if (!button.getAttribute("data-label")) {
        button.setAttribute("data-label", button.textContent.trim());
    }
    button.textContent = "Playing sample…";
    button.disabled = true;

    var patterns = {
        piano: [
            [261.63, 0.00, 0.32], [329.63, 0.38, 0.32], [392.00, 0.76, 0.32],
            [523.25, 1.14, 0.50], [392.00, 1.72, 0.32], [329.63, 2.10, 0.32],
            [261.63, 2.48, 0.62]
        ],
        guitar: [
            [196.00, 0.00, 0.28], [246.94, 0.34, 0.28], [293.66, 0.68, 0.28],
            [392.00, 1.02, 0.42], [293.66, 1.52, 0.28], [246.94, 1.86, 0.28],
            [196.00, 2.20, 0.55]
        ],
        violin: [
            [440.00, 0.00, 0.36], [493.88, 0.40, 0.36], [587.33, 0.80, 0.36],
            [659.25, 1.20, 0.52], [587.33, 1.78, 0.36], [493.88, 2.18, 0.36],
            [440.00, 2.58, 0.60]
        ]
    };

    var waveforms = { piano: "triangle", guitar: "triangle", violin: "sawtooth" };
    var notes = patterns[instrument] || patterns.piano;
    var master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.04);
    master.connect(context.destination);

    notes.forEach(function (note) {
        var oscillator = context.createOscillator();
        var volume = context.createGain();
        var start = context.currentTime + note[1];
        var end = start + note[2];

        oscillator.type = waveforms[instrument] || "triangle";
        oscillator.frequency.setValueAtTime(note[0], start);
        volume.gain.setValueAtTime(0.0001, start);
        volume.gain.exponentialRampToValueAtTime(instrument === "violin" ? 0.22 : 0.35, start + 0.035);
        volume.gain.setValueAtTime(instrument === "violin" ? 0.18 : 0.28, Math.max(start + 0.04, end - 0.07));
        volume.gain.exponentialRampToValueAtTime(0.0001, end);
        oscillator.connect(volume);
        volume.connect(master);
        oscillator.start(start);
        oscillator.stop(end + 0.02);
    });

    window.setTimeout(function () {
        if (activeAudioContext === context) {
            context.close();
            activeAudioContext = null;
            button.disabled = false;
            button.textContent = button.getAttribute("data-label");
            activeAudioButton = null;
        }
    }, 3400);
}
