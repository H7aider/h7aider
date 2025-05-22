// Global array to store job scenarios
const jobScenarios = [
    {
        id: 'truck_driver',
        displayName: 'Truck Driver',
        riskLevel: 'High',
        aiImpact: 'High risk of automation from self-driving technology, potentially reducing demand for human drivers for long-haul routes.',
        emergingJobs: ['Logistics Coordinator for Autonomous Fleets', 'Remote Vehicle Operator', 'Drone Delivery Specialist', 'AI Maintenance Technician for Vehicles'],
        challenges: ['Significant retraining needed for new roles', 'Regulatory hurdles for autonomous vehicles', 'Public acceptance of autonomous transport', 'Infrastructure for autonomous vehicle support']
    },
    {
        id: 'software_developer',
        displayName: 'Software Developer',
        riskLevel: 'Medium',
        aiImpact: 'AI tools can automate coding tasks, assist in debugging, and accelerate development cycles. The role will likely shift towards AI-assisted development, requiring new skills in AI integration and tool usage.',
        emergingJobs: ['AI/ML Engineer', 'AI Tools Developer', 'Prompt Engineer', 'AI Ethics and Governance Specialist'],
        challenges: ['Keeping up with rapidly evolving AI tools and techniques', 'Potential for job displacement in routine coding tasks', 'Ethical implications of AI software']
    },
    {
        id: 'radiologist',
        displayName: 'Radiologist',
        riskLevel: 'Medium',
        aiImpact: 'AI can assist in image analysis, potentially increasing accuracy and speed, but human oversight remains crucial. The role may evolve to focus on complex cases and AI tool management.',
        emergingJobs: ['AI Imaging Specialist', 'Medical Data Scientist', 'Clinical AI Ethicist', 'Radiology AI System Validator'],
        challenges: ['Need to learn and adapt to AI-assisted diagnostic tools', 'Ensuring data privacy and security of patient data with AI systems', 'Ethical considerations of AI in diagnosis', 'Integration of AI into existing clinical workflows']
    },
    {
        id: 'retail_salesperson',
        displayName: 'Retail Salesperson',
        riskLevel: 'High',
        aiImpact: 'AI-powered kiosks, chatbots, and automated checkout systems can handle many customer interactions and transactions. Roles may shift towards customer experience, complex problem-solving, and managing in-store technology.',
        emergingJobs: ['Retail Tech Specialist', 'Customer Experience Concierge', 'E-commerce Integration Manager', 'Personalized Shopping AI Curator'],
        challenges: ['Need for digital literacy and customer service skills', 'Reduced number of traditional cashier and floor staff roles', 'Adapting to AI-driven inventory and sales tools']
    },
    {
        id: 'teacher_educator',
        displayName: 'Teacher / Educator',
        riskLevel: 'Low',
        aiImpact: 'AI can personalize learning, automate grading, and provide administrative support. Teachers can focus more on mentorship, critical thinking skills, and socio-emotional learning, using AI as an assistant.',
        emergingJobs: ['AI Curriculum Developer', 'Educational Technologist specializing in AI', 'Personalized Learning Facilitator', 'Data Analyst for Student Performance (AI-assisted)'],
        challenges: ['Integrating AI tools effectively into pedagogy', 'Ensuring equitable access to AI learning tools', 'Ethical concerns around student data and AI bias', 'Training educators to use AI effectively']
    }
];

function populateJobOptions() {
    const jobSelection = document.getElementById('job_selection');
    if (!jobSelection) {
        console.error("Job selection dropdown not found for populating!");
        return;
    }

    jobSelection.innerHTML = ''; // Clear existing options

    jobScenarios.forEach(job => {
        const option = document.createElement('option');
        option.value = job.id;
        option.textContent = job.displayName;
        jobSelection.appendChild(option);
    });
}

function runSimulation() {
    const jobSelection = document.getElementById('job_selection');
    const simulationOutput = document.getElementById('simulation_output');

    if (!jobSelection || !simulationOutput) {
        console.error("Required elements (job selection or simulation output) not found.");
        if (simulationOutput) {
            simulationOutput.innerHTML = "Error: Essential page elements are missing.";
        }
        return;
    }

    const selectedJobId = jobSelection.value;

    if (!selectedJobId) {
        simulationOutput.innerHTML = "<p>Please select a job category to see the simulation.</p>";
        return;
    }

    const selectedJob = jobScenarios.find(job => job.id === selectedJobId);

    if (selectedJob) {
        let emergingJobsHtml = '<ul>';
        selectedJob.emergingJobs.forEach(job => {
            emergingJobsHtml += `<li>${job}</li>`;
        });
        emergingJobsHtml += '</ul>';

        let challengesHtml = '<ul>';
        selectedJob.challenges.forEach(challenge => {
            challengesHtml += `<li>${challenge}</li>`;
        });
        challengesHtml += '</ul>';

        const riskClass = `risk-${selectedJob.riskLevel.toLowerCase()}`;
        simulationOutput.innerHTML = `
            <h2>${selectedJob.displayName} <span class="risk-level-display ${riskClass}">${selectedJob.riskLevel} Risk</span></h2>
            <h3>AI Impact:</h3>
            <p>${selectedJob.aiImpact}</p>
            <h3>Potential Emerging Jobs:</h3>
            ${emergingJobsHtml}
            <h3>Challenges for the Workforce:</h3>
            ${challengesHtml}
        `;
    } else {
        simulationOutput.innerHTML = "<p>Error: Selected job details not found. Please try refreshing.</p>";
        console.error("Selected job ID not found in jobScenarios: ", selectedJobId);
    }
}

// Event listener will be added in a subsequent step
// after the button is added to index.html.

document.addEventListener('DOMContentLoaded', function() {
    populateJobOptions(); // Populate jobs on load

    const runButton = document.getElementById('run_button');
    if (runButton) {
        runButton.addEventListener('click', runSimulation);
    } else {
        console.error("Run button not found!");
    }
});
