const RESUME = {
  name: "Vikas Sharma",
  role: "Data Analyst",
  experience: "1+ year",
  skills: ["SQL","MySQL","Power BI","Birst BI","Python","Pandas","NumPy","Advanced Excel","Data Cleaning","Data Validation","Data Visualization","Dashboard Development","KPI Reporting","ETL Concepts","Data Warehousing","Star Schema","Fact & Dimension Modeling","Jupyter Notebook","Git","GitHub"],
  projects: [
    ["Customer Sales Analytics Dashboard","Birst BI, SQL, Power BI","KPI-driven business insights"],
    ["Credit Risk & Loan Analytics Dashboard","Power BI, SQL, Excel","Lending analysis and KPI reports"],
    ["Sales Performance Dashboard","Power BI, SQL","Sales trends and automated reporting"],
    ["Power Consumption Analysis","Python, SQL","Energy usage pattern analysis"]
  ]
};

const LESSONS = [
  {id:"sql",skill:"SQL",title:"SQL JOINs",time:"20 min",text:"Connect tables confidently and explain why the join type changes the result set.",body:"Learn INNER JOIN for matching rows and LEFT JOIN when you must keep every row from the left table. Always decide which table should be preserved before writing the JOIN.",example:"SELECT c.customer_id, c.name, SUM(o.amount) AS sales\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.customer_id\nGROUP BY c.customer_id, c.name;"},
  {id:"powerbi",skill:"Power BI",title:"KPI-first dashboard design",time:"20 min",text:"Build a dashboard around business questions instead of filling a page with charts.",body:"Start with the decision the stakeholder needs to make. Put 3–5 core KPIs first, then trend, segment and drill-down views. Keep naming consistent and validate totals against the source.",example:"KPI examples:\n• Revenue\n• Orders\n• Average Order Value\n• Conversion Rate"},
  {id:"python",skill:"Python",title:"Pandas data cleaning",time:"25 min",text:"Turn messy tabular data into analysis-ready data with repeatable steps.",body:"A reliable cleaning flow is: inspect → identify missing/duplicate values → standardize types → clean categories → validate row counts and key measures.",example:"df.info()\ndf.isna().sum()\ndf.duplicated().sum()\ndf['amount'] = pd.to_numeric(df['amount'], errors='coerce')"},
  {id:"modeling",skill:"Data Warehousing",title:"Star Schema",time:"20 min",text:"Understand fact and dimension tables and explain why the model helps BI reporting.",body:"A fact table stores measurable events at a defined grain. Dimension tables describe those events. The first interview question to answer is: what is the grain of the fact table?",example:"FactSales\n→ DateKey\n→ CustomerKey\n→ ProductKey\n→ Quantity\n→ SalesAmount\n\nDimensions: Date, Customer, Product"},
  {id:"quality",skill:"Data Quality",title:"Data validation checks",time:"15 min",text:"Protect reporting reliability with simple, repeatable checks.",body:"Validate row counts, nulls in key fields, duplicates, allowed categories, date ranges and reconciliation totals. Explain what happens when a check fails.",example:"Checks:\n1. Duplicate business keys\n2. Null primary keys\n3. Invalid dates\n4. Total mismatch vs source"}
];

const QUESTIONS = [
  {q:"Which JOIN keeps every row from the left table?",a:["INNER JOIN","LEFT JOIN","RIGHT JOIN","CROSS JOIN"],correct:1,why:"LEFT JOIN keeps all rows from the left table and matches rows from the right where available."},
  {q:"What should you define before designing a fact table?",a:["Font size","Grain","Dashboard theme","Company name"],correct:1,why:"The grain defines exactly what one row represents and prevents incorrect aggregations."},
  {q:"Which pandas check quickly counts missing values per column?",a:["df.shape","df.isna().sum()","df.describe()","df.head()"],correct:1,why:"isna() marks missing values and sum() counts them by column."},
  {q:"A KPI dashboard should usually start with:",a:["20 decorative charts","Core business KPIs","A logo","A pie chart"],correct:1,why:"Decision-focused dashboards put core KPIs first, then supporting detail."},
  {q:"Which is a useful data-quality validation?",a:["Changing chart colors","Checking duplicate keys","Adding more pages","Renaming the company"],correct:1,why:"Duplicate-key checks catch common data integrity problems before reporting."}
];

const key = "vikas-career-v1";
let state = JSON.parse(localStorage.getItem(key) || "null") || {lessonsDone: [], answers: [], jobs: [], currentQuestion: 0};

function save(){localStorage.setItem(key, JSON.stringify(state)); renderStats();}
function byId(id){return document.getElementById(id);}

function navigate(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.go===id));
  if(id==="learn") renderLessons();
  if(id==="practice") renderQuiz();
  if(id==="apply") renderJobs();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-go]").forEach(el=>el.addEventListener("click",()=>navigate(el.dataset.go)));

function renderStats(){
  byId("lessonsDone").textContent = state.lessonsDone.length;
  const total=state.answers.length, correct=state.answers.filter(v=>v===true).length;
  byId("practiceScore").textContent = total ? Math.round(correct/total*100)+"%" : "0%";
  byId("applicationCount").textContent = state.jobs.length;
  byId("savedCount").textContent = state.jobs.filter(j=>j.status==="Saved").length;
  byId("appliedCount").textContent = state.jobs.filter(j=>j.status==="Applied").length;
  byId("interviewCount").textContent = state.jobs.filter(j=>j.status==="Interview").length;
  byId("streak").textContent = state.lessonsDone.length ? "On track" : "1 day";
}

function renderChips(){
  byId("skillMap").innerHTML = RESUME.skills.slice(0,12).map(s=>"<span class=\"chip\">"+s+"</span>").join("");
  byId("profileSkills").innerHTML = RESUME.skills.map(s=>"<span class=\"chip\">"+s+"</span>").join("");
  byId("projects").innerHTML = RESUME.projects.map(p=>"<div class=\"project\"><strong>"+p[0]+"</strong><span>"+p[1]+"</span><p>"+p[2]+"</p></div>").join("");
}

function renderLessons(){
  byId("lessonList").innerHTML = LESSONS.map(l=>"<button class=\"lesson card\" data-lesson=\""+l.id+"\"><div><span class=\"badge\">"+l.skill+"</span><h3>"+l.title+"</h3><p class=\"muted\">"+l.text+"</p></div><span class=\"pill\">"+(state.lessonsDone.includes(l.id)?"Done":"Start")+" · "+l.time+"</span></button>").join("");
  document.querySelectorAll("[data-lesson]").forEach(b=>b.addEventListener("click",()=>{
    const l=LESSONS.find(x=>x.id===b.dataset.lesson), d=byId("lessonDetail");
    d.classList.remove("hidden");
    d.innerHTML="<p class=\"eyebrow\">"+l.skill+"</p><h3>"+l.title+"</h3><p class=\"muted\">"+l.body+"</p><div class=\"example\">"+l.example+"</div><button class=\"primary full\" id=\"completeLesson\">"+(state.lessonsDone.includes(l.id)?"Completed":"Mark lesson complete")+"</button>";
    byId("completeLesson").addEventListener("click",()=>{
      if(!state.lessonsDone.includes(l.id)) state.lessonsDone.push(l.id);
      save(); renderLessons(); d.classList.add("hidden");
    });
  }));
}

function renderQuiz(){
  const i=state.currentQuestion % QUESTIONS.length, item=QUESTIONS[i], answered=state.answers[i] !== undefined;
  byId("questionCounter").textContent=(i+1)+" / "+QUESTIONS.length;
  byId("quizCard").innerHTML="<p class=\"eyebrow\">INTERVIEW QUESTION</p><h2>"+item.q+"</h2><div class=\"answers\">"+item.a.map((x,idx)=>"<button class=\"answer "+(answered?(idx===item.correct?"correct":idx===state.answers[i]?"wrong":""):"")+"\" data-answer=\""+idx+"\" "+(answered?"disabled":"")+">"+x+"</button>").join("")+"</div><div class=\"quiz-footer\">"+(answered?"<span class=\"score\">✓ "+item.why+"</span>":"")+"<button class=\"secondary\" id=\"nextQuestion\">"+(answered?"Next question":"Choose an answer")+"</button></div>";
  document.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>{
    if(state.answers[i]!==undefined)return;
    state.answers[i]=Number(b.dataset.answer)===item.correct;
    state.currentQuestion=i;
    save(); renderQuiz();
  }));
  byId("nextQuestion").addEventListener("click",()=>{
    if(state.answers[i]===undefined)return;
    state.currentQuestion=(i+1)%QUESTIONS.length; save(); renderQuiz();
  });
}

function renderJobs(){
  if(!state.jobs.length){byId("jobList").innerHTML="<div class=\"card\"><strong>No applications yet.</strong><p class=\"muted\">Add your first Data Analyst application and keep the status here.</p></div>";return;}
  byId("jobList").innerHTML=state.jobs.map((j,i)=>"<div class=\"job card\"><div class=\"job-top\"><div><h3>"+escapeHtml(j.role)+"</h3><p class=\"muted\">"+escapeHtml(j.company)+"</p></div><span class=\"status\">"+escapeHtml(j.status)+"</span></div><p class=\"muted\">"+escapeHtml(j.notes||"No notes")+"</p><div class=\"job-actions\"><select data-status=\""+i+"\"><option "+(j.status==="Saved"?"selected":"")+">Saved</option><option "+(j.status==="Applied"?"selected":"")+">Applied</option><option "+(j.status==="Interview"?"selected":"")+">Interview</option><option "+(j.status==="Rejected"?"selected":"")+">Rejected</option><option "+(j.status==="Selected"?"selected":"")+">Selected</option></select><button class=\"secondary\" data-delete=\""+i+"\">Delete</button></div></div>").join("");
  document.querySelectorAll("[data-status]").forEach(s=>s.addEventListener("change",()=>{state.jobs[Number(s.dataset.status)].status=s.value;save();renderJobs();}));
  document.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{state.jobs.splice(Number(b.dataset.delete),1);save();renderJobs();}));
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}

const modal=byId("jobModal");
byId("addJobBtn").addEventListener("click",()=>modal.classList.remove("hidden"));
byId("closeModal").addEventListener("click",()=>modal.classList.add("hidden"));
byId("saveJob").addEventListener("click",()=>{
  const company=byId("jobCompany").value.trim(), role=byId("jobRole").value.trim();
  if(!company||!role)return;
  state.jobs.unshift({company,role,status:byId("jobStatus").value,notes:byId("jobNotes").value.trim()});
  ["jobCompany","jobRole","jobNotes"].forEach(id=>byId(id).value="");
  modal.classList.add("hidden"); save(); renderJobs();
});
byId("resetBtn").addEventListener("click",()=>{if(confirm("Reset your local app progress?")){localStorage.removeItem(key);location.reload();}});

byId("todayTitle").textContent=LESSONS[0].title;
byId("todayText").textContent=LESSONS[0].text;
renderChips(); renderStats(); renderLessons(); renderQuiz(); renderJobs();
