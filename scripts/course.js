
const courseListEl    = document.getElementById('course-list');
const creditsTotalEl  = document.getElementById('credits-total');
const filterButtons   = document.querySelectorAll('.filter-btn');


const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
    technology: ['Python'],
    completed: true,
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course introduces students to the World Wide Web and to careers in Web site design and development. The course is hands on with students actually participating in simple Web designs and programming.',
    technology: ['HTML', 'CSS'],
    completed: true,
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will teach the students to solve problems by decomposing them into functions. The students will learn to write, call, debug, and test functions. The students will do this by solving problems in a variety of domains.',
    technology: ['Python'],
    completed: true,
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce the students to programming with classes. Websites will be reused, integrating theoretical foundations and practical applications of object-oriented programming to solve problems.',
    technology: ['C#'],
    completed: false,
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: true,
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will write their own API requests, handle responses, create reusable components, and benignly follow accessibility standards.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: false,
  },
];


function renderCourses(courseArray) {

  courseListEl.innerHTML = '';

  courseArray.forEach((course) => {
    const card = document.createElement('div');

    card.classList.add('course-card', course.completed ? 'completed' : 'incomplete');

    card.textContent = `${course.subject} ${course.number}${course.completed ? ' ✓' : ''}`;
    card.title = course.title;

    courseListEl.appendChild(card);
  });

  updateCredits(courseArray);
}

function updateCredits(courseArray) {
  const total = courseArray.reduce((sum, course) => sum + course.credits, 0);
  creditsTotalEl.textContent = `The total credits for courses listed above is ${total}`;
}


filterButtons.forEach((button) => {
  button.addEventListener('click', () => {

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    const filtered =
      filter === 'all'
        ? courses
        : courses.filter((course) => course.subject === filter);

    renderCourses(filtered);
  });
});

renderCourses(courses);
