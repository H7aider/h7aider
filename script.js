// --- DOM ELEMENTS ---
// We will get references to the HTML elements here to interact with them.
document.addEventListener('DOMContentLoaded', () => {

    const startBtn = document.getElementById('start-simulation-btn');
    const advanceYearBtn = document.getElementById('advance-year-btn');
    const resetBtn = document.getElementById('reset-simulation-btn');

    const currentYearEl = document.getElementById('current-year');
    const aiLevelEl = document.getElementById('ai-level');
    const unemploymentRateEl = document.getElementById('unemployment-rate');
    const happinessLevelEl = document.getElementById('happiness-level');
    const eventLogEl = document.getElementById('event-log');
    const threatenedJobsListEl = document.getElementById('threatened-jobs-list');

    // --- CONSTANTS ---
    const INITIAL_JOBS = [
        { name: 'سائق شاحنة', sector: 'النقل', automationRisk: 0.9, workforce: 4000000 },
        { name: 'ممثل خدمة العملاء', sector: 'الخدمات', automationRisk: 0.8, workforce: 6000000 },
        { name: 'محاسب', sector: 'المالية', automationRisk: 0.7, workforce: 3000000 },
        { name: 'مطور برمجيات', sector: 'التكنولوجيا', automationRisk: 0.4, workforce: 2000000 },
        { name: 'طبيب', sector: 'الرعاية الصحية', automationRisk: 0.2, workforce: 1500000 },
        { name: 'معلم', sector: 'التعليم', automationRisk: 0.1, workforce: 5000000 },
        { name: 'فنان', sector: 'الإبداع', automationRisk: 0.05, workforce: 1000000 },
    ];
    const MAX_AI_LEVEL = 100;

    // --- RANDOM EVENTS ---
    const RANDOM_EVENTS = [
        {
            description: "اختراق علمي كبير يسرّع من تطور الذكاء الاصطناعي!",
            probability: 0.05,
            trigger: (state) => state.aiLevel > 20 && state.aiLevel < 80,
            effect: (state) => {
                state.aiLevel += 10;
                return state;
            }
        },
        {
            description: "ركود اقتصادي عالمي يؤدي إلى تباطؤ الاستثمار في التكنولوجيا.",
            probability: 0.03,
            trigger: (state) => state.year > 2030,
            effect: (state) => {
                state.aiLevel -= 5;
                state.happiness -= 10;
                return state;
            }
        },
        {
            description: "حركة مقاومة شعبية ضد الأتمتة تنجح في فرض قيود تنظيمية.",
            probability: 0.07,
            trigger: (state) => state.unemploymentRate > 15,
            effect: (state) => {
                // Slows down automation impact for a year by temporarily reducing risk
                state.jobs.forEach(j => j.automationRisk *= 0.5);
                logEvent("تأثير المقاومة الشعبية سيقلل من فقدان الوظائف لهذا العام.");
                return state;
            }
        },
        {
            description: "الحكومة تطلق برنامج دعم ودخل أساسي شامل لمواجهة البطالة.",
            probability: 0.1,
            trigger: (state) => state.unemploymentRate > 20,
            effect: (state) => {
                state.happiness += 20;
                state.unemploymentRate *= 0.9; // Simulate people being helped
                return state;
            }
        }
    ];

    // --- SIMULATION STATE ---
    let simulationState = {};

    // Function to reset the state to its initial values
    function initializeState() {
        simulationState = {
            year: 2024,
            aiLevel: 1,
            unemploymentRate: 5.0,
            happiness: 95,
            isStarted: false,
            jobs: JSON.parse(JSON.stringify(INITIAL_JOBS)), // Deep copy
            totalWorkforce: INITIAL_JOBS.reduce((sum, job) => sum + job.workforce, 0),
            unemployed: (INITIAL_JOBS.reduce((sum, job) => sum + job.workforce, 0) * 0.05)
        };
    }

    // --- FUNCTIONS ---

    function logEvent(message, type = 'info') {
        const li = document.createElement('li');
        li.textContent = `[${simulationState.year}] ${message}`;
        // Optional: Add classes for styling based on type (e.g., 'event-warning', 'event-critical')
        eventLogEl.prepend(li);
    }

    function getAiLevelName(level) {
        if (level < 10) return "بدائي";
        if (level < 30) return "مساعد";
        if (level < 60) return "متقدم";
        if (level < 90) return "شبه مستقل";
        return "ذكاء فائق";
    }

    function getHappinessLevelName(happiness) {
        if (happiness < 20) return "انهيار اجتماعي";
        if (happiness < 40) return "غضب شديد";
        if (happiness < 60) return "قلق وتوتر";
        if (happiness < 80) return "حذر وترقب";
        return "استقرار ورضا";
    }

    function updateJobDisplay() {
        threatenedJobsListEl.innerHTML = ''; // Clear existing list

        simulationState.jobs.forEach(job => {
            const initialJob = INITIAL_JOBS.find(j => j.name === job.name);
            const workforcePercentage = (job.workforce / initialJob.workforce) * 100;

            let barColorClass = 'var(--success-color)';
            if (workforcePercentage < 70) barColorClass = 'var(--warning-color)';
            if (workforcePercentage < 40) barColorClass = 'var(--danger-color)';

            const li = document.createElement('li');
            li.classList.add('job-item');
            li.innerHTML = `
                <div class="job-name">${job.name}</div>
                <div class="job-workforce">العاملون: ${Math.round(job.workforce).toLocaleString()}</div>
                <div class="workforce-bar-container">
                    <div class="workforce-bar" style="width: ${workforcePercentage}%; background-color: ${barColorClass};"></div>
                </div>
            `;
            threatenedJobsListEl.appendChild(li);
        });
    }

    function updateUI() {
        currentYearEl.textContent = simulationState.year;
        unemploymentRateEl.textContent = `${simulationState.unemploymentRate.toFixed(1)}%`;
        aiLevelEl.textContent = getAiLevelName(simulationState.aiLevel);
        happinessLevelEl.textContent = getHappinessLevelName(simulationState.happiness);
        updateJobDisplay();
    }

    function advanceOneYear() {
        if (!simulationState.isStarted) return;

        simulationState.year++;

        // 1. AI Growth (S-curve-like growth)
        const growthRate = 0.1 * (1 - simulationState.aiLevel / MAX_AI_LEVEL);
        simulationState.aiLevel += simulationState.aiLevel * growthRate + 1;
        simulationState.aiLevel = Math.min(simulationState.aiLevel, MAX_AI_LEVEL);
        logEvent(`تطور الذكاء الاصطناعي إلى المستوى ${simulationState.aiLevel.toFixed(0)}.`);

        // 2. Job Automation (Refined formula for more realistic progression)
        let totalJobsLostThisYear = 0;
        simulationState.jobs.forEach(job => {
            const innovationFactor = (simulationState.aiLevel / MAX_AI_LEVEL);
            // The exponent makes the job loss slow at first and accelerate dramatically later.
            const jobsLost = job.workforce * Math.pow(job.automationRisk * innovationFactor, 2) * 0.2;

            job.workforce -= jobsLost;
            totalJobsLostThisYear += jobsLost;
        });

        simulationState.unemployed += totalJobsLostThisYear;
        const currentTotalWorkforce = simulationState.jobs.reduce((sum, job) => sum + job.workforce, 0);
        simulationState.totalWorkforce = currentTotalWorkforce + simulationState.unemployed;
        simulationState.unemploymentRate = (simulationState.unemployed / simulationState.totalWorkforce) * 100;

        logEvent(`${Math.round(totalJobsLostThisYear).toLocaleString()} شخص فقدوا وظائفهم بسبب الأتمتة.`, 'warning');

        // 3. Happiness update
        simulationState.happiness -= simulationState.unemploymentRate * 0.2;
        simulationState.happiness = Math.max(0, simulationState.happiness);

        // 4. Check for Random Events
        RANDOM_EVENTS.forEach(event => {
            if (event.trigger(simulationState) && Math.random() < event.probability) {
                logEvent(`حدث خاص: ${event.description}`, 'event');
                simulationState = event.effect(simulationState);
            }
        });

        updateUI();
    }

    function startSimulation() {
        initializeState();
        simulationState.isStarted = true;
        startBtn.disabled = true;
        advanceYearBtn.disabled = false;
        resetBtn.style.display = 'inline-block';

        logEvent("بدأت المحاكاة! تطور الذكاء الاصطناعي يبدأ الآن.");
        updateUI();
    }

    function resetSimulation() {
        initializeState();
        eventLogEl.innerHTML = '';
        logEvent("تمت إعادة تعيين المحاكاة. يمكنك البدء من جديد.");

        startBtn.disabled = false;
        advanceYearBtn.disabled = true;
        resetBtn.style.display = 'none';

        updateUI();
    }


    // --- EVENT LISTENERS ---
    startBtn.addEventListener('click', startSimulation);
    advanceYearBtn.addEventListener('click', advanceOneYear);
    resetBtn.addEventListener('click', resetSimulation);

    // Initial log message
    console.log("Simulation script loaded. Waiting for user to start.");
});
