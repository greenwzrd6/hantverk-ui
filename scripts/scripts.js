import { ref, createApp, computed } from "vue";

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

const workerData = [
    {
        "id": 1,
        "name": "Anders Björk",
        "professions": ["Carpenter", "Mason"],
        "bookings": [
            { "activity": "Carpenter", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Mason", "percentage": 50, "status": "Preliminary", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Carpenter", "percentage": 100, "status": "Booked", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 2,
        "name": "Björn Eriksson",
        "professions": ["Electrician"],
        "bookings": [
            { "activity": "Electrician", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-05-01" },
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-04-21", "to": "2026-05-01" },
            { "activity": "Electrician", "percentage": 100, "status": "Booked", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 3,
        "name": "Carl Holm",
        "professions": ["Painter"],
        "bookings": [
            { "activity": "Painter", "percentage": 50, "status": "Preliminary", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Painter", "percentage": 100, "status": "Booked", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 4,
        "name": "David Lindqvist",
        "professions": ["Mason"],
        "bookings": [
            { "activity": "Mason", "percentage": 100, "status": "Booked", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Mason", "percentage": 50, "status": "Booked", "from": "2026-05-04", "to": "2026-05-15" },
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 5,
        "name": "Erik Magnusson",
        "professions": ["Plumber"],
        "bookings": [
            { "activity": "Plumber", "percentage": 100, "status": "Booked", "from": "2026-04-21", "to": "2026-04-28" },
            { "activity": "Plumber", "percentage": 50, "status": "Preliminary", "from": "2026-04-29", "to": "2026-05-15" }
        ]
    },
    {
        "id": 6,
        "name": "Filip Nilsson",
        "professions": ["Carpenter"],
        "bookings": [
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Carpenter", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Carpenter", "percentage": 100, "status": "Booked", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 7,
        "name": "Gustav Olsson",
        "professions": ["Carpenter"],
        "bookings": [
            { "activity": "Carpenter", "percentage": 50, "status": "Preliminary", "from": "2026-04-21", "to": "2026-04-25" },
            { "activity": "Carpenter", "percentage": 100, "status": "Booked", "from": "2026-04-28", "to": "2026-05-08" },
            { "activity": "Carpenter", "percentage": 50, "status": "Booked", "from": "2026-05-11", "to": "2026-05-15" }
        ]
    },
    {
        "id": 8,
        "name": "Hans Persson",
        "professions": ["Electrician", "Plumber"],
        "bookings": [
            { "activity": "Electrician", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-05-01" },
            { "activity": "Plumber", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-05-01" },
            { "activity": "Plumber", "percentage": 100, "status": "Preliminary", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 9,
        "name": "Ivan Qvist",
        "professions": ["Painter", "Mason"],
        "bookings": [
            { "activity": "Painter", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Mason", "percentage": 100, "status": "Preliminary", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 10,
        "name": "Jan Rydén",
        "professions": ["Carpenter", "Electrician"],
        "bookings": [
            { "activity": "Carpenter", "percentage": 100, "status": "Booked", "from": "2026-04-21", "to": "2026-04-28" },
            { "activity": "Other", "percentage": 100, "status": "Absent", "from": "2026-04-29", "to": "2026-05-05" },
            { "activity": "Electrician", "percentage": 50, "status": "Preliminary", "from": "2026-05-06", "to": "2026-05-15" }
        ]
    },
    {
        "id": 11,
        "name": "Karl Svensson",
        "professions": ["Carpenter", "Painter"],
        "bookings": [
            { "activity": "Carpenter", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-05-01" },
            { "activity": "Painter", "percentage": 50, "status": "Preliminary", "from": "2026-04-21", "to": "2026-05-01" },
            { "activity": "Painter", "percentage": 100, "status": "Booked", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 12,
        "name": "Lars Thorén",
        "professions": ["Painter"],
        "bookings": [
            { "activity": "Painter", "percentage": 100, "status": "Booked", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Painter", "percentage": 50, "status": "Preliminary", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 13,
        "name": "Magnus Undén",
        "professions": ["Mason"],
        "bookings": [
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-04-21", "to": "2026-04-28" },
            { "activity": "Mason", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-04-28" },
            { "activity": "Mason", "percentage": 100, "status": "Booked", "from": "2026-04-29", "to": "2026-05-15" }
        ]
    },
    {
        "id": 14,
        "name": "Nils Viklund",
        "professions": ["Plumber"],
        "bookings": [
            { "activity": "Plumber", "percentage": 100, "status": "Booked", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Plumber", "percentage": 50, "status": "Preliminary", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 15,
        "name": "Oscar Wahlberg",
        "professions": ["Carpenter"],
        "bookings": [
            { "activity": "Carpenter", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-04-25" },
            { "activity": "Carpenter", "percentage": 100, "status": "Booked", "from": "2026-04-28", "to": "2026-05-08" },
            { "activity": "Carpenter", "percentage": 50, "status": "Preliminary", "from": "2026-05-11", "to": "2026-05-15" }
        ]
    },
    {
        "id": 16,
        "name": "Petra Jansson",
        "professions": ["Mason"],
        "bookings": [
            { "activity": "Mason", "percentage": 100, "status": "Booked", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Mason", "percentage": 50, "status": "Preliminary", "from": "2026-05-04", "to": "2026-05-08" },
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-05-04", "to": "2026-05-08" },
            { "activity": "Other", "percentage": 100, "status": "Absent", "from": "2026-05-11", "to": "2026-05-15" }
        ]
    },
    {
        "id": 17,
        "name": "Pär Zetterberg",
        "professions": ["Electrician"],
        "bookings": [
            { "activity": "Other", "percentage": 100, "status": "Absent", "from": "2026-04-21", "to": "2026-04-25" },
            { "activity": "Electrician", "percentage": 100, "status": "Booked", "from": "2026-04-28", "to": "2026-05-08" },
            { "activity": "Electrician", "percentage": 50, "status": "Booked", "from": "2026-05-11", "to": "2026-05-15" }
        ]
    },
    {
        "id": 18,
        "name": "Rolf Åberg",
        "professions": ["Painter"],
        "bookings": [
            { "activity": "Painter", "percentage": 50, "status": "Preliminary", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Painter", "percentage": 100, "status": "Booked", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 19,
        "name": "Stefan Öberg",
        "professions": ["Mason"],
        "bookings": [
            { "activity": "Mason", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Mason", "percentage": 100, "status": "Preliminary", "from": "2026-05-04", "to": "2026-05-11" },
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-05-12", "to": "2026-05-15" },
            { "activity": "Mason", "percentage": 50, "status": "Booked", "from": "2026-05-12", "to": "2026-05-15" }
        ]
    },
    {
        "id": 20,
        "name": "Tobias Alm",
        "professions": ["Plumber"],
        "bookings": [
            { "activity": "Plumber", "percentage": 100, "status": "Booked", "from": "2026-04-21", "to": "2026-04-28" },
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-04-29", "to": "2026-05-05" },
            { "activity": "Plumber", "percentage": 50, "status": "Preliminary", "from": "2026-04-29", "to": "2026-05-05" },
            { "activity": "Plumber", "percentage": 100, "status": "Booked", "from": "2026-05-06", "to": "2026-05-15" }
        ]
    },
    {
        "id": 21,
        "name": "Ulf Berg",
        "professions": ["Carpenter"],
        "bookings": [
            { "activity": "Carpenter", "percentage": 100, "status": "Booked", "from": "2026-04-21", "to": "2026-05-01" },
            { "activity": "Carpenter", "percentage": 50, "status": "Preliminary", "from": "2026-05-04", "to": "2026-05-15" }
        ]
    },
    {
        "id": 22,
        "name": "Viktor Cederlund",
        "professions": ["Electrician"],
        "bookings": [
            { "activity": "Electrician", "percentage": 50, "status": "Preliminary", "from": "2026-04-21", "to": "2026-04-25" },
            { "activity": "Electrician", "percentage": 100, "status": "Booked", "from": "2026-04-28", "to": "2026-05-08" },
            { "activity": "Electrician", "percentage": 50, "status": "Booked", "from": "2026-05-11", "to": "2026-05-15" }
        ]
    },
    {
        "id": 23,
        "name": "Xavier Ek",
        "professions": ["Mason"],
        "bookings": [
            { "activity": "Mason", "percentage": 100, "status": "Booked", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-05-04", "to": "2026-05-08" },
            { "activity": "Mason", "percentage": 50, "status": "Preliminary", "from": "2026-05-04", "to": "2026-05-08" },
            { "activity": "Mason", "percentage": 100, "status": "Booked", "from": "2026-05-11", "to": "2026-05-15" }
        ]
    },
    {
        "id": 24,
        "name": "Walter Dahl",
        "professions": ["Painter"],
        "bookings": [
            { "activity": "Painter", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-04-25" },
            { "activity": "Painter", "percentage": 100, "status": "Booked", "from": "2026-04-28", "to": "2026-05-08" },
            { "activity": "Painter", "percentage": 50, "status": "Preliminary", "from": "2026-05-11", "to": "2026-05-15" }
        ]
    },
    {
        "id": 25,
        "name": "Yngve Falk",
        "professions": ["Plumber"],
        "bookings": [
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-04-21", "to": "2026-04-28" },
            { "activity": "Plumber", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-04-28" },
            { "activity": "Plumber", "percentage": 100, "status": "Booked", "from": "2026-04-29", "to": "2026-05-15" }
        ]
    },
    {
        "id": 26,
        "name": "Zara Gunnarsson",
        "professions": ["Carpenter"],
        "bookings": [
            { "activity": "Carpenter", "percentage": 50, "status": "Preliminary", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Carpenter", "percentage": 50, "status": "Booked", "from": "2026-05-04", "to": "2026-05-08" },
            { "activity": "Carpenter", "percentage": 100, "status": "Booked", "from": "2026-05-11", "to": "2026-05-15" }
        ]
    },
    {
        "id": 27,
        "name": "Åsa Hedlund",
        "professions": ["Electrician"],
        "bookings": [
            { "activity": "Electrician", "percentage": 50, "status": "Booked", "from": "2026-04-21", "to": "2026-04-28" },
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-04-21", "to": "2026-04-28" },
            { "activity": "Electrician", "percentage": 100, "status": "Booked", "from": "2026-04-29", "to": "2026-05-08" },
            { "activity": "Electrician", "percentage": 50, "status": "Preliminary", "from": "2026-05-11", "to": "2026-05-15" }
        ]
    },
    {
        "id": 28,
        "name": "Örjan Isaksson",
        "professions": ["Painter"],
        "bookings": [
            { "activity": "Painter", "percentage": 100, "status": "Booked", "from": "2026-04-21", "to": "2026-04-30" },
            { "activity": "Painter", "percentage": 50, "status": "Preliminary", "from": "2026-05-04", "to": "2026-05-08" },
            { "activity": "Other", "percentage": 50, "status": "Absent", "from": "2026-05-04", "to": "2026-05-08" },
            { "activity": "Other", "percentage": 100, "status": "Absent", "from": "2026-05-11", "to": "2026-05-15" }
        ]
    }
]

//Functions
function getMonth(startDate) {
    const days = []
    const date = new Date(startDate)
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

// Navigation
const startDate = ref('2026-04-21')
const days = computed(() => getMonth(startDate.value))

function goForward() {
    const d = new Date(startDate.value)
    d.setDate(d.getDate() + 28)
    startDate.value = d.toISOString().split('T')[0]
}

function goBack() {
    const d = new Date(startDate.value)
    d.setDate(d.getDate() - 28)
    startDate.value = d.toISOString().split('T')[0]
}

function today() {
    startDate.value = new Date().toISOString().split('T')[0]
}

//Components
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

        return { weeks }
    },
    template: `
        <div class="worker-row">
            <span>{{ worker.name }}</span>
            <div class="week" v-for="(week, index) in weeks" :key="index">
                <day-icon v-for="day in week" :key="day.date" :booking-status="day.status">
                </day-icon>
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
    components: { WorkerList },
    setup() {
        const workers = ref(workerData)
        return { workers, days, goForward, goBack, today }
    }
}

createApp(app).mount('#app')