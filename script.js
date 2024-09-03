let progressValues = [0, 0, 0, 0];  // Track progress for each habit
const maxPoints = 30;  // Maximum points for each habit

function updateProgress(habitIndex) {
    if (progressValues[habitIndex - 1] < maxPoints) {
        progressValues[habitIndex - 1]++;
        const progressElement = document.getElementById(`progress${habitIndex}`);
        const percentage = (progressValues[habitIndex - 1] / maxPoints) * 100;
        progressElement.style.width = `${percentage}%`;
        updateCharacter();
        disableButton(habitIndex);
    }
}

function updateCharacter() {
    const totalPoints = progressValues.reduce((a, b) => a + b, 0);
    const characterImage = document.getElementById("characterImage");

    if (totalPoints >= 40) {
        characterImage.src = "character5.png";
    } else if (totalPoints >= 30) {
        characterImage.src = "character4.png";
    } else if (totalPoints >= 20) {
        characterImage.src = "character3.png";
    } else if (totalPoints >= 10) {
        characterImage.src = "character2.png";
    } else {
        characterImage.src = "character1.png";
    }
}

function disableButton(habitIndex) {
    const button = document.getElementById(`button${habitIndex}`);
    button.disabled = true;

    setTimeout(() => {
        button.disabled = false;
    },500 );  86400000// Enable after 24 hours
}
