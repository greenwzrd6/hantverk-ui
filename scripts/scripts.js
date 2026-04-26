import { ref, createApp, computed, onMounted } from "vue";

//Data
const iconData =
{
    // 100%
    "Booked": "assets/100.svg",
    "Preliminary": "assets/prelim.svg",
    "Absent": "assets/absent.svg",
    "Free": "assets/free.svg",

    //50%/50%
    "Booked_Preliminary": "assets/prelim-100.svg",
    "Free_Booked": "assets/50.svg",
    "Free_Preliminary": "assets/prelim-50.svg",
    "Absent_Booked": "assets/100-absent.svg",
    "Absent_Preliminary": "assets/prelim-absent.svg"
}

//Functions
function getMonth(startDate) {
    const days = []
    const date = new Date(startDate)
    date.setHours(12, 0, 0, 0)
    while (days.length < 20) {
        const day = date.getDay()
        if (day !== 0 && day !== 6) {
            days.push(date.toISOString().split("T")[0])
        }
        date.setDate(date.getDate() + 1)
    }
    return days
}

function getDateStatus(bookings, date) {
    const d = new Date(date)
    const matchingDate = bookings.filter(booking => {
        return d >= new Date(booking.from) && d <= new Date(booking.to)
    })

    if (matchingDate.length === 0) return "Free"
    if (matchingDate.length === 1) {
        if (matchingDate[0].percentage === 50) {
            return "Free_" + matchingDate[0].status
        }
        return matchingDate[0].status
    }

    const bookingStatus = matchingDate.map(booking => booking.status).sort()
    if (bookingStatus[0] === bookingStatus[1]) return bookingStatus[0]
    return bookingStatus[0] + "_" + bookingStatus[1]
}

function getWeekNumber(dateString) {
    const date = new Date(dateString)
    const dateCopy = new Date(date.valueOf())

    const dayNum = (date.getDay() + 6) % 7

    //ISO-dates are based on Thursdays
    const firstThursday = dateCopy.setDate(dateCopy.getDate() - dayNum + 3).valueOf()

    dateCopy.setMonth(0, 1)

    if (dateCopy.getDay() !== 4) {
        dateCopy.setMonth(0, 1 + ((4 - dateCopy.getDay()) + 7) % 7)
    }

    return 1 + Math.ceil((firstThursday - dateCopy) / 604800000)
}

//Components
const NavButtons = {
    template: `
        <div class="nav-buttons">
            <button @click="$emit('prev')">← Föregående</button>
            <button @click="$emit('today')">Idag</button>
            <button @click="$emit('next')">Nästa →</button>
        </div>
    `
}

const HeaderComponent = {
    props: ["dynamicDate"],
    components: { NavButtons },
    template: `
        <header class="header">
            <h1>Svenssons Hantverk AB</h1>
            <div class="inner-header">
                <div class="inner-header-left">
                    <h2>Bemanningsöversikt</h2>
                </div>
                <div class="inner-header-right">
                    <p>{{ dynamicDate }}</p>
                    <nav-buttons
                        @prev="$emit('go-back')" 
                        @today="$emit('today')" 
                        @next="$emit('go-forward')">
                    </nav-buttons>
                </div>
            </div>
        </header>
    `
}

const WorkerInfo = {
    template: `
        <div class="worker-info">
            <div class="worker-info-card">
                <h2>Hantverkare helt lediga</h2>
                <p>minst en hel ledig vecka</p>
                <img src="assets/upsize-icon.svg" alt="upsize-icon">
            </div>
            <div class="worker-info-card">
                <h2>Hantverkare med 50% kvar</h2>
                <p>Kan ta ett jobb till</p>
                <img src="assets/upsize-icon.svg" alt="upsize-icon">
            </div>
            <div class="worker-info-card">
                <h2>Preliminärt bokade</h2>
                <p>Kan frigöras om affären faller</p>
                <img src="assets/upsize-icon.svg" alt="upsize-icon">
            </div>
        </div>
    `
}

const StatusInfo = {
    template: `
        <div class="status-info">
            <div class="status-info-text">
                <img src="assets/100-small.svg" alt="100% Bokad" class="small-icon">
                <p>Bokad(100%)</p>
            </div>
            <div class="status-info-text">
                <img src="assets/50-small.svg" alt="50% Bokad" class="small-icon">
                <p>Bokad(50%)</p>
            </div>
            <div class="status-info-text">
                <img src="assets/prelim-small.svg" alt="100% Preliminärt Bokad" class="small-icon">
                <p>Preliminär(100%)</p>
            </div>
            <div class="status-info-text">
                <img src="assets/prelim-50-small.svg" alt="50% Preliminärt Bokad" class="small-icon">
                <p>Preliminär(50%)</p>
            </div>
            <div class="status-info-text">
                <img src="assets/absent-small.svg" alt="Frånvarande" class="small-icon">
                <p>Frånvaro</p>
            </div>
            <div class="status-info-text">
                <img src="assets/free-small.svg" alt="Ledig" class="small-icon">
                <p>Ledig</p>
            </div>
        </div>
    `
}

const SortWorker = {
    template: `
        <div class="sort-worker">
            <h3>Yrke:</h3>
            <button @click="$emit('filter', 'Alla')">Alla</button>
            <button @click="$emit('filter', 'Carpenter')">Snickare</button>
            <button @click="$emit('filter', 'Electrician')">Elektriker</button>
            <button @click="$emit('filter', 'Painter')">Målare</button>
            <button @click="$emit('filter', 'Mason')">Murare</button>
            <button @click="$emit('filter', 'Plumber')">Rörmokare</button>
        </div>
    `
}

const ScheduleDates = {
    props: ["days"],
    setup(props) {
        const range = (startDate, endDate) => {
            const start = new Date(startDate)
            const end = new Date(endDate)

            const day = { day: "numeric" }
            const month = { month: "short" }

            return `${start.toLocaleDateString('sv-SE', day)} ${start.toLocaleDateString('sv-SE', month)} - ` +
                `${end.toLocaleDateString('sv-SE', day)} ${end.toLocaleDateString('sv-SE', month)}`;
        }

        const weeks = computed(() => {
            if (!props.days || props.days.length === 0) return [];

            return [0, 5, 10, 15].map(index => {
                const monday = props.days[index]
                const friday = props.days[index + 4]

                return {
                    nr: getWeekNumber(monday),
                    range: range(monday, friday)
                }
            })
        })

        return { weeks }
    },
    template: `
        <div class="dates">
            <div v-for="week in weeks" :key="week.nr" class="dates-info">
                <h2>v.{{ week.nr }}</h2>
                <p>{{ week.range }}</p>
            </div>
        </div>
    `
}

const DayIcon = {
    props: {
        bookingStatus: String
    },
    setup(props) {
        const icon = computed(() => iconData[props.bookingStatus])
        return { icon }
    },
    template: `<img :src="icon" :alt="bookingStatus">`
}

const WorkerRow = {
    props: {
        worker: Object,
        days: Array
    },
    components: { DayIcon },
    setup(props) {
        const translatedProfessions = {
            "Carpenter": "Snickare",
            "Mason": "Murare",
            "Electrician": "Elektriker",
            "Painter": "Målare",
            "Plumber": "Rörmokare"
        }

        const formattedProfessions = computed(() => {
            return props.worker.professions
                .map(p => translatedProfessions[p] || p).join("/")
        })

        const schedule = computed(() => {
            return props.days.map(date => ({
                date,
                status: getDateStatus(props.worker.bookings, date)
            }))
        })

        const weeks = computed(() => {
            const result = []
            for (let i = 0; i < 4; i++) {
                result.push(schedule.value.slice(i * 5, i * 5 + 5))
            }
            return result
        })

        return { weeks, formattedProfessions }
    },
    template: `
        <div class="worker-row">
            <div class="worker-name-profession">
                <span class="name">{{ worker.name }}</span>
                <span class="profession">{{ formattedProfessions }}</span>
            </div>
            <div class="weeks-container">
                <div class="week" v-for="(week, index) in weeks" :key="index">
                    <day-icon v-for="day in week" :key="day.date" :booking-status="day.status">
                    </day-icon>
                </div>
            </div>
        </div>
    `
}

const WorkerList = {
    components: { WorkerRow },
    props: {
        workers: Array,
        days: Array
    },
    template: `
        <div class="worker-list">
            <worker-row 
                v-for="worker in workers"
                :key="worker.id"
                :worker="worker"
                :days="days">
            </worker-row>
        </div>
    `
}

const app = {
    components: {
        WorkerList,
        HeaderComponent,
        WorkerInfo,
        StatusInfo,
        SortWorker,
        ScheduleDates
    },
    setup() {
        const workers = ref([])
        const startDate = ref(new Date().toISOString().split("T")[0])
        const days = computed(() => getMonth(startDate.value))

        //Function to get all data from the API
        const fetchData = async () => {
            try {
                const resp = await fetch("https://yrgo-web-services.netlify.app/bookings")
                if (!resp.ok) throw new Error("Gick inte att hämta datan...")
                const data = await resp.json()
                workers.value = data
            }
            catch (e) {
                console.error("Error: " + e)
            }
        }

        //Runs the function when the DOM has been loaded
        onMounted(() => {
            fetchData()
        })

        //Sorting function for workers
        const selectedProfession = ref("Alla")

        const selectedWorkers = computed(() => {
            if (selectedProfession.value === "Alla") return workers.value

            return workers.value.filter(worker =>
                worker.professions.includes(selectedProfession.value)
            )
        })

        //Function to make the dates dynamic
        const dynamicDate = computed(() => {
            if (days.value.length === 0) return "";

            const firstDate = new Date(days.value[0])
            const lastDate = new Date(days.value[days.value.length - 1]);
            const options = { day: 'numeric', month: 'short' };

            return `${firstDate.toLocaleDateString('sv-SE', options)} - ${lastDate.toLocaleDateString('sv-SE', options)}`;
        })

        //Navigation buttons
        function goForward() {
            const d = new Date(startDate.value)
            d.setHours(12, 0, 0, 0);
            d.setDate(d.getDate() + 28)
            startDate.value = d.toISOString().split('T')[0]
        }

        function goBack() {
            const d = new Date(startDate.value)
            d.setHours(12, 0, 0, 0);
            d.setDate(d.getDate() - 28)
            startDate.value = d.toISOString().split('T')[0]
        }

        function today() {
            const d = new Date()
            d.setHours(12, 0, 0, 0);
            startDate.value = new Date().toISOString().split('T')[0]
        }

        return { workers, days, selectedProfession, selectedWorkers, dynamicDate, goForward, goBack, today }
    }
}

createApp(app).mount('#app')