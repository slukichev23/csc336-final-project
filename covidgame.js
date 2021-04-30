(function () {

  "use strict";

  window.addEventListener("load", init);

  // Variables
  let leval = 4
  let event_counter = 0; // This helps us keep track of events so that we can remove them from the icon menu in the bottom left
  let infection_rates = .1
  let gdp = 21.43
  let gdp_ = 21.43
  let vaccine = 0
  let questions_number = 0
  let infected_population = 0
  let approval_rating = .8
  let mostDeathCount = 1
  let days = 1
  const bestGPD = 25
  const population = 330000000

  function init() {
    
    // When answer butten is clicked call the button function which changes when for every question
    id("event-button").addEventListener("click", function () { button_function() })

    // add the first 3 icons
    add_event_icon()
    add_event_icon()
    add_event_icon()

    // start butten for the game
    id('day-sec-button').addEventListener("click", function () {
      
      // start the loop for add the event icom
      setInterval(() => {
        // check if events-div has more than 8 child Element
        if(id("events-div").childElementCount < 8){
          add_event_icon()
        }
      },8000)

      // set the difficulty level
      leval = (10 - id('day-sec').value) * 4
      leval = leval < 4 ? 4 : leval

      // map loop updates the map
      setInterval(nextEvent, id('day-sec').value * 1000)

      // romve the home page and show the game 
      id('home-page').style.display = 'none'

    })
  }

  // updatible function: function be changed when the questions ar changed
  let button_function = () => { }
  
  const questions = [
    {
      event: 'start',
      type: 'Time', // types: vaccine, economy, policy, time
      needs_state: false,
      question: 'Scientists have discovered a new virus that started in {state} and has begun spreading into neighboring states at an alarming rate. Not much is known about this virus but action needs to be taken immediately. What do we do?',
      answers: [
        ['Nothing', -1, 0, 0],
        ['Make a public announcement encouraging people to be cautious', 0.1, 0, 0],
        ['Institute a mask mandate', 0.4, -0.2, 0],
        ['Declare a national emergency and start a lockdown', 1, -1, 0],
      ]
    },
    {
      event: 'start',
      type: 'Time',// types: vaccine, economy, policy, time
      needs_state: true,
      question: 'The first reported death from the COVID-19 virus has been reported in {state}. Scientists have discovered that this virus is highly infectious and is transmitted through respiratory droplets. Not only that, but the virus appears to be incredibly persistent and it is not known how long it takes for the immune system to completely rid the body of the virus. Experts recommend implementing a mask mandate and asking everyone to maintain social distancing of 6 feet at all times. What is your course of action?',
      answers: [
        ['Nothing', -1, 0, 0],
        ['Follow the advice of the scientific community', 0.75, -0.5, 0],
        ['Lie to the public to reduce potential panic', -1, 0.3, 0],
        ['Start a lockdown', 1, -1, 0],
      ]
    },
    {
      event: 'start',
      type: 'Time',// types: vaccine, economy, policy, time
      needs_state: false,
      question: 'Several online conspiratorial groups have become vocal critics of the existence of the novel coronavirus, claiming it to be fabricated by the government to limit personal freedoms. Will you make a public statement on the matter?',
      answers: [
        ['Nothing', -1, 0, 0],
        ['Voice your support for the conspiracy theorists on national television', -1, 0.5, -1],
        ['Publicly denounce the conspiracy theorists', 0.3, 0, 0.5],
        ['Arrest members of the groups for spreading misinformation and endangering lives', 0.2, 0, 0],
      ]
    },
    {
      event: 'start',
      type: 'Time',// types: vaccine, economy, policy, time
      needs_state: true,
      question: 'A large college party in {state} has attracted the attention of police due to noise complaints. Several experts have voiced their concern for large public gatherings and are calling for them to be banned for the duration of the pandemic. What is your course of action?',
      answers: [
        ['Nothing', -1, 0, 0],
        ['Encourage public gatherings', -1, 0.25, 0],
        ['Temporarily ban public gathering', 0.9, -0.8, 0],
        ['Temporarily ban public gatherings and punish the college students involved', 0.91, -0.8, 0],
      ]
    },
    {
      event: 'start',
      type: 'Policy',// types: vaccine, economy, policy, time
      needs_state: false,
      question: 'The total number of people infected with COVID-19 has reached record highs and civil unrest is growing. Due to many people being out of work, many working class families are struggling to make their next rent payments. Experts warn of a potential wave of evictions that could worsen the pandemic. What is your course of action?',
      answers: [
        ['Nothing', -1, 0, 0],
        ['Urge congress to pass a rushed relief bill that will include a 1 time stimulus check', 0.2, 0.3, 0.1],
        ['Begin drafting a comprehensive relief bill that will focus on protecting small businesses and delivering stimulus checks to all struggling families as well as a moratorium on evictions', 0.2, 0.5, 0.3],
        ['Draft a relief bill that will mostly support the wealthy donors and corporations that keep you in power and only think about the people later', 0, 0.1, 0],
      ]
    },
    {
      event: 'start',
      type: 'Vaccine',// types: vaccine, economy, policy, time
      needs_state: false,
      question: 'A bill has been put on your desk that will allow the federal government to allocate more of its budget to vaccine research and development. Pharmaceutical companies that plan to manufacture and distribute the vaccine are lobbying to completely remove the price limits set by the government. What is your course of action',
      answers: [
        ['Nothing', -1, 0.15, -1],
        ['Sign the bill but remove government price caps on the vaccine even if fewer people would be able to afford the vaccine', 0.2, 0.5, 0.75],
        ['Sign the bill but keep the government price caps on the vaccine as is', 0.3, 0.25, 0.8],
        ['Sign the bill but make the vaccine completely free for all citizens', 0.4, -0.35, 0.85],
      ]
    },
    {
      event: 'start',
      type: 'Vaccine',// types: vaccine, economy, policy, time
      needs_state: false,
      question: 'Several vocal anti-vaxxer protests have made their way to the gates of the White House demanding that vaccine development be stopped immediately, along with numerous questionable claims about the harmful effects of vaccines. What is your course of action?',
      answers: [
        ['Nothing', -0.3, 0, -0.15],
        ['Concede to the protestors demands and order that vaccine development be greatly slowed down until further notice', -1, 0.5, -1],
        ['Publicly denounce the anti-vaxxer protestors', 0.4, 0, 0.2],
        ['Denounce the protestors and punish them for participating in large public gatherings during a pandemic', 0.45, 0, 0.2],
      ]
    },
    {
      event: 'null',
      type: 'Vaccine',// types: vaccine, economy, policy, time
      needs_state: false,
      question: 'The current head of the Center for Disease Control and Prevention estimates that it will take upwards of 8 months to fully develop and begin distribution of the COVID-19 vaccine. Depending on your decision today, we could potentially speed up this process. What is your course of action?',
      answers: [
        ['Nothing', -1, 0.2, -0.8],
        ['Deregulate the pharmaceutical industry to allow to faster development of the vaccine', 0, 0.5, 0.8],
        ['Pass a bill that would give even more money to the companies developing the vaccine', 0, -0.4, 0.5],
        ['Create a government agency that would take control of vaccine research and distribution and ban private companies from interfering', 0, -0.75, 1],
      ]
    },
    {
      event: 'null',
      type: 'Policy',// types: vaccine, economy, policy, time
      needs_state: true,
      question: 'A large political action committee from {state} has been lobbying the government to divert some of the vaccine development funds over to social programs to support poor and working class families at the expense of delaying vaccine distribution. What is your course of action?',
      answers: [
        ['Nothing', 0, 0, 0],
        ['Concede to their demands ', -0.2, -0.4, -0.55],
        ['Do the opposite and support the vaccine development effort even more', 0.2, -0.4, 0.7],
        ['Make a compromise and only divert a small amount of resources away from vaccine development to social programs', 0, -0.2, -0.3],
      ]
    },
    {
      event: 'null',
      type: 'Vaccine',// types: vaccine, economy, policy, time
      needs_state: false,
      question: 'The vaccine has successfully been developed but there is debate over the specifics of its roll out. Experts advise that essential workers and the elderly should be the first to receive the vaccine, civil rights groups argue that everyone over the age of 16 should have access to the vaccine immediately, and anti-vaxxers argue that the vaccine should be abandoned entirely. What is your course of action?',
      answers: [
        ['Nothing', -0.5, -0.3, -0.4],
        ['Agree with the experts, administer the vaccine to the elderly and essential workers first before the general population', 0.7, 0.5, 0.8],
        ['Agree with the civil rights groups, give everyone over the age of 16 access to the vaccine', 1, 0, 1],
        ['Agree with the anti-vaxxers and scrap the vaccine program entirely', -1, 0, -1],
      ]
    },
    {
      event: 'null',
      type: 'Policy',// types: vaccine, economy, policy, time
      needs_state: true,
      question: 'A sudden outbreak has occurred in a small town in {state}. Upwards of 2000 new cases have been reported in the past couple of days alone. What is your course of action?',
      answers: [
        ['Nothing', -1, 0.5, 0],
        ['Contact trace all of the new cases', 0.5, -0.1, 0],
        ['Enforce quarantine for all the newly infected people', 0.8, -0.75, 0],
        ['Shut down the city for 2 weeks', 1, -1, 0],
      ]
    },
    {
      event: 'null',
      type: 'Economy',// types: vaccine, economy, policy, time
      needs_state: true,
      question: 'A city in {state} has been suffering major financial ruin after over 30% of its population has become unemployed. What is your course of action?',
      answers: [
        ['Nothing', 0, -1, 0],
        ['Provide financial aid', 0.25, -0.25, 0],
        ['Re open business in the area with no restrictions', -1, 1, 0],
        ['Re open businesses in the area with a mandatory mask mandate and social distancing guidelines', 0.35, 0.8, 0],
      ]
    },
    {
      event: 'null',
      type: 'Policy',// types: vaccine, economy, policy, time
      needs_state: true,
      question: 'A large number of protestors have been marching outside of {state}’s capital city demanding that quarantine and social distancing orders be lessened. What is your course of action?',
      answers: [
        ['Nothing', 0, 0, 0],
        ['Punish the protestors for breaking social distancing orders', 0.4, -0.2, 0],
        ['Concede the the protestor’s demands and lessen restrictions', -0.5, 0.6, 0],
        ['Arrest the protestors and institute a strict curfew for the entire city', 0.9, -0.9, 0],
      ]
    },
    { // ### 
      event: 'GDP FALLS',
      type: 'Economy',// types: vaccine, economy, policy, time
      needs_state: false,
      question: 'Businesses small and large are closing left and right, the stock market is experiencing record losses, and the population is losing faith in the current financial system’s ability to weather this pandemic. What is your course of action?',
      answers: [
        // 1 best -1 worst
        // answer, virus, economy, vaccine progress
        ['Do nothing. Let the businesses fail and let the free market take its course', 0, -0.9, 0],
        ['Print several trillions of dollars to pump into the stock market and future stimulus bills. Worry about hyperinflation later, preventing total economic collapse is more important', 0, 0.5, 0],
        ['Socialize major industries to give the government more direct control over the economy. The free market has clearly failed.', 0.6, 0.5, 0],
        ['Initiate immense austerity measures and focus on providing citizens with the bare necessities to stay alive. Survival is more important than social programs.', -0.25, 1, 0],
      ]
    },
    { // ### FOLLOWING 3 QUESTIONS ARE IF INFECTED POPULATION > 40% ###
      event: 'NFECTED POPULATION 80',
      type: 'Policy',// types: vaccine, economy, policy, time
      needs_state: false,
      question: 'As millions of people have died from COVID-19 and the infected rate of the country has reached 40%, your advisors are recommending immediate and drastic action to be taken. Many government officials have not so subtly remarked that inaction may or may not result in you being overthrown from your position. What is your course of action?',
      answers: [
        ['Nothing', -1, -1, -1],
        ['Order an indefinite lockdown and curfew ', 0.9, -1, 0.75],
        ['Allow the government to seize control of vital industries to prevent total economic collapse', 0, 0.5, 0.2],
        ['Declare a national emergency and institute martial law', 1, -0.75, 1],
      ]
    },
    {
      event: 'NFECTED POPULATION 80',
      type: 'Policy',// types: vaccine, economy, policy, time
      needs_state: false,
      question: 'There are simply not enough people left in good health to bury all of the victims that have died as a result of the virus. Despite that, something has to be done about all of the bodies littering the streets. What is your course of action?',
      answers: [
        ['Nothing', -0.5, 0, 0],
        ['Force healthy civilians to transport the bodies to mass grave sites', -1, -0.75, 0],
        ['Order the military to clean up and incinerate the bodies', -0.35, 0, 0],
        ['Mandate that citizens may only go out in public wearing protective suits', 0.5, 0.3, 0.5],
      ]
    },
    {
      event: 'NFECTED POPULATION 80',
      type: 'Policy',// types: vaccine, economy, policy, time
      needs_state: false,
      question: 'Vaccination rates simply are not keeping up with new COVID-19 cases. What is your course of action?',
      answers: [
        ['Nothing', -1, 0, -0.5],
        ['Allocate more money and resources to pharmaceutical companies to distribute the vaccine', 0.5, -0.5, 0.6],
        ['Seize control of pharmaceutical companies and create a government owned distribution organization', 0.5, -0.5, 1],
        ['Forcefully vaccinate everyone who has not received the vaccine yet', 1, 0, 1],
      ]
    }
  ]

  const status_neighbors = {
    'Alabama': ['Florida', 'Georgia', 'Mississippi', 'Tennessee'],
    'Alaska': ['Hawaii'],
    'Arizona': ['California', 'Colorado', 'Nevada', 'New Mexico', 'Utah'],
    'Arkansas': ['Louisiana', 'Mississippi', 'Missouri', 'Oklahoma', 'Tennessee', 'Texas'],
    'California': ['Arizona', 'Nevada', 'Oregon'],
    'Colorado': ['Arizona', 'Kansas', 'Nebraska', 'New Mexico', 'Oklahoma', 'Utah', 'Wyoming'],
    'Connecticut': ['Massachusetts', 'New York', 'Rhode Island'],
    'Delaware': ['Maryland', 'New Jersey', 'Pennsylvania'],
    'Florida': ['Alabama', 'Georgia'],
    'Georgia': ['Alabama', 'Florida', 'North Carolina', 'South Carolina', 'Tennessee'],
    'Hawaii': ['Alaska'],
    'Idaho': ['Montana', 'Nevada', 'Oregon', 'Utah', 'Washington', 'Wyoming'],
    'Illinois': ['Indiana', 'Iowa', 'Michigan', 'Kentucky', 'Missouri', 'Wisconsin'],
    'Indiana': ['Illinois', 'Kentucky', 'Michigan', 'Ohio'],
    'Iowa': ['Illinois', 'Minnesota', 'Missouri', 'Nebraska', 'South Dakota', 'Wisconsin'],
    'Kansas': ['Colorado', 'Missouri', 'Nebraska', 'Oklahoma'],
    'Kentucky': ['Illinois', 'Indiana', 'Missouri', 'Ohio', 'Tennessee', 'Virginia', 'West Virginia'],
    'Louisiana': ['Arkansas', 'Mississippi', 'Texas'],
    'Maine': ['New Hampshire'],
    'Maryland': ['Delaware', 'Pennsylvania', 'Virginia', 'West Virginia'],
    'Massachusetts': ['Connecticut', 'New Hampshire', 'New York', 'Rhode Island', 'Vermont'],
    'Michigan': ['Illinois', 'Indiana', 'Minnesota', 'Ohio', 'Wisconsin'],
    'Minnesota': ['Iowa', 'Michigan', 'North Dakota', 'South Dakota', 'Wisconsin'],
    'Mississippi': ['Alabama', 'Arkansas', 'Louisiana', 'Tennessee'],
    'Missouri': ['Arkansas', 'Illinois', 'Iowa', 'Kansas', 'Kentucky', 'Nebraska', 'Oklahoma', 'Tennessee'],
    'Montana': ['Idaho', 'North Dakota', 'South Dakota', 'Wyoming'],
    'Nebraska': ['Colorado', 'Iowa', 'Kansas', 'Missouri', 'South Dakota', 'Wyoming'],
    'Nevada': ['Arizona', 'California', 'Idaho', 'Oregon', 'Utah'],
    'New Hampshire': ['Maine', 'Massachusetts', 'Vermont'],
    'New Jersey': ['Delaware', 'New York', 'Pennsylvania'],
    'New Mexico': ['Arizona', 'Colorado', 'Oklahoma', 'Texas', 'Utah'],
    'New York': ['Connecticut', 'Massachusetts', 'New Jersey', 'Pennsylvania', 'Rhode Island', 'Vermont'],
    'North Carolina': ['Georgia', 'South Carolina', 'Tennessee', 'Virginia'],
    'North Dakota': ['Minnesota', 'Montana', 'South Dakota'],
    'Ohio': ['Indiana', 'Kentucky', 'Michigan', 'Pennsylvania', 'West Virginia'],
    'Oklahoma': ['Arkansas', 'Colorado', 'Kansas', 'Missouri', 'New Mexico', 'Texas'],
    'Oregon': ['California', 'Idaho', 'Nevada', 'Washington'],
    'Pennsylvania': ['Delaware', 'Maryland', 'New Jersey', 'New York', 'Ohio', 'West Virginia'],
    'Rhode Island': ['Connecticut', 'Massachusetts', 'New York'],
    'South Carolina': ['Georgia', 'North Carolina'],
    'South Dakota': ['Iowa', 'Minnesota', 'Montana', 'Nebraska', 'North Dakota', 'Wyoming'],
    'Tennessee': ['Alabama', 'Arkansas', 'Georgia', 'Kentucky', 'Mississippi', 'Missouri', 'North Carolina', 'Virginia'],
    'Texas': ['Arkansas', 'Louisiana', 'New Mexico', 'Oklahoma'],
    'Utah': ['Arizona', 'Colorado', 'Idaho', 'Nevada', 'New Mexico', 'Wyoming'],
    'Vermont': ['Massachusetts', 'New Hampshire', 'New York'],
    'Virginia': ['Kentucky', 'Maryland', 'North Carolina', 'Tennessee', 'West Virginia'],
    'Washington': ['Idaho', 'Oregon'],
    'West Virginia': ['Kentucky', 'Maryland', 'Ohio', 'Pennsylvania', 'Virginia'],
    'Wisconsin': ['Illinois', 'Iowa', 'Michigan', 'Minnesota'],
    'Wyoming': ['Colorado', 'Idaho', 'Montana', 'Nebraska', 'South Dakota', 'Utah']
  }

  const clean_state_stats = {
    'Alabama': 0, 'Alaska': 0, 'Arizona': 0, 'Arkansas': 0, 'California': 0, 'Colorado': 0, 'Connecticut': 0, 'Delaware': 0, 'Florida': 0, 'Georgia': 0, 'Hawaii': 0, 'Idaho': 0, 'Illinois': 0, 'Indiana': 0, 'Iowa': 0, 'Kansas': 0, 'Kentucky': 0, 'Louisiana': 0, 'Maine': 0, 'Maryland': 0, 'Massachusetts': 0, 'Michigan': 0, 'Minnesota': 0, 'Mississippi': 0, 'Missouri': 0, 'Montana': 0, 'Nebraska': 0, 'Nevada': 0, 'New Hampshire': 0, 'New Jersey': 0, 'New Mexico': 0, 'New York': 0, 'North Carolina': 0, 'North Dakota': 0, 'Ohio': 0, 'Oklahoma': 0, 'Oregon': 0, 'Pennsylvania': 0, 'Rhode Island': 0, 'South Carolina': 0, 'South Dakota': 0, 'Tennessee': 0, 'Texas': 0, 'Utah': 0, 'Vermont': 0, 'Virginia': 0, 'Washington': 0, 'West Virginia': 0, 'Wisconsin': 0, 'Wyoming': 0
  }

  const state_names = Object.keys(status_neighbors)
  let last_state_stats = Object.assign({}, clean_state_stats)

  // map loop updates the map
  function nextEvent() {
    
    // crate a new state_names to set up the next infected Number of the states
    const state_stats = Object.assign({}, clean_state_stats)

    // update the infected Number of the states
    state_names.forEach(state => {

      // add the neighbors_infections 
      let neighbors_infections = 0

      status_neighbors[state].forEach(neighbor => {
        neighbors_infections += last_state_stats[neighbor]
      })

      // get the uninfected population
      let rate_controller = ((population - infected_population)  / population)

      // addup 97% of the state infected Number, the numbers infected Number, and some random variance
      state_stats[state] =
        (last_state_stats[state] * 0.97 ) +
        ((neighbors_infections / status_neighbors[state].length) * .02 * rate_controller) +
        Math.floor(Math.random() * (last_state_stats[state] * infection_rates * rate_controller))

    })

    // genrate random outbracks in the states
    let outbracks_states = []
    for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
      outbracks_states.push(state_names[Math.floor(Math.random() * 50)])
    }

    // unique
    outbracks_states = outbracks_states.filter((v, i, _) => _.indexOf(v) === i);

    outbracks_states.forEach((state) => {
      state_stats[state] += ((infected_population < 1000) ? Math.floor(infected_population / 10) + 1 : 300)
    })

    // get the most deth count of state
    mostDeathCount = Math.max(...Object.values(state_stats))

    // change the color of the states in the html
    state_names.forEach(state => {
      id(state).style.fill = `rgb(255,${255 - ((state_stats[state] / mostDeathCount) * 255)},${255 - ((state_stats[state] / mostDeathCount) * 255)})`
    })

    // the total infected population 
    infected_population = Math.floor(Object.values(state_stats).reduce((a, b) => a + b, 0))

    // Add a day 
    days += 1

    // update html
    id('Infected-population').innerHTML = numberWithCommas(infected_population)
    id('Days').innerHTML = numberWithCommas(days)

    last_state_stats = state_stats

  }

  function add_event_icon() {

    // get the next best fitting questions | if the conditions below are true they will change the queton outputes
    let { type, question, needs_state, answers } = get_next_questions(
      (infected_population / population) > .4, // if the infected_population is grater the 40%
      ((gdp_) / bestGPD) < .5 // if the gdp_ less then half of bestGPD
    )

    // create the icon and add it to the html
    let event_icon = gen("img");
    event_icon.src = `images/${type}.svg`
    event_icon.id = "event_number_" + event_counter.toString()
    event_icon.classList.add('icons')

    // event when icon is clicked
    event_icon.addEventListener("click", function () {

      // if the question needs a state the replace the '{state}' with a random state name
      if (needs_state) {
        question = question.split('{state}').join(state_names[Math.floor(Math.random() * 50)])
      }
      // add question and type to html
      id("questionc").innerHTML = question
      id("question-type").innerHTML = type + ' type question:'

      // add the answers to html
      id("answerc").innerHTML = answers
        .map((a, i) => `<li class="answer"><input type="radio" id="q${i}" value="${i}" name="answers"><label for="q${i}">${a[0]}</label></li>`)
        .join('')

      // show pop up
      id("event-popup").classList.remove("hidden");
      let icon = this; 

      // when the answer button is clicked it will trigger the function
      button_function = function () {

        // get the answers from 
        let [_, virus, economy, vaccine_progress] = answers[Number(findSelection('answers'))]

        // calculate the difference values for the game 
        infection_rates = infection_rates + ((virus * -1) / 100)

        gdp = gdp * (1 + economy/30)
        gdp_ = gdp * ((population - (infected_population / 2)) / population)

        vaccine += vaccine_progress

        approval_rating = 100;
        _ = Math.round((1 - infection_rates) * 100)
        approval_rating = _ < approval_rating ? _ : approval_rating

        _ = 100 * (gdp_ / bestGPD)
        approval_rating = _ < approval_rating ? _ : approval_rating

        _ = ((population - infected_population) / population) * 200
        approval_rating = _ < approval_rating ? _ : approval_rating

        approval_rating = approval_rating < 0 ? 0 : approval_rating
        approval_rating = approval_rating > 100 ? 100 : approval_rating

        // see if the player won or lost based on the game values 
        if (approval_rating < 30) {
          id("you-lost").classList.remove("hidden");
        } else if (vaccine > leval) {
          id("you-won").classList.remove("hidden")
        }

        // update game values on the HTML
        id("GPD").innerHTML = gdp_.toString().slice(0, 5)
        id("Infection-Rates").innerHTML = (infection_rates + 1).toString().slice(0,5)
        id("approval-rating").innerHTML = approval_rating.toString().slice(0, 5)
        id("event-popup").classList.add("hidden");

        // update the innerBar Progress bar
        id("innerBar").style.width = ((vaccine / leval) * 20) + 'vw'

        icon.remove();

      }

    });

    // add the events-div to the list of events
    id("events-div").appendChild(event_icon);
    event_counter += 1;
  }

  let get_next_questions = (_, __) => {

    // return the first six questions form the start then change the get_next questions so it can return based on the game context
    if (questions_number < 6) {
      questions_number += 1
      return questions[questions_number]
    } else {
      // retun questions based on the game context 
      get_next_questions = (infectedPopulation = false, econmpey = false) => {
        let _questions;
        if (infectedPopulation) {
          console.log('infectedPopulation')
          _questions = questions.filter(question => question.event == 'NFECTED POPULATION 80')
        } else if (econmpey) {
          console.log('econmpey')
          _questions = questions.filter(question => question.event == 'GDP FALLS')
        } else {
          console.log('null')
          _questions = questions.filter(question => question.event == 'null')
        }

        questions_number += 1
        console.log(_questions.length)
        return _questions[Math.floor(Math.random() * _questions.length)]

      }

      return get_next_questions()

    }

  }

  // HELPER FUNCTIONS:
  // Returns random index number for a given length n.
  function random_amount(n) {
    // returns 0 through n-1
    return Math.floor(Math.random() * Math.floor(n));
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // get the Selection from the answers
  function findSelection(field) {
    var test = document.getElementsByName(field);
    var sizes = test.length;
    for (let i = 0; i < sizes; i++) {
      if (test[i].checked == true) {
        return test[i].value;
      }
    }
  }

}());
