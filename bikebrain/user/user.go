package user

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"net/http/cookiejar"
	"time"

	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/bike"
)

type GetRandomBikeFunc func() *bike.Bike

type User struct {
	Id            string
	Jar           *cookiejar.Jar
	Client        *http.Client
	Endpoint      string
	GetRandomBike GetRandomBikeFunc
	CurrentBikeId string

	Verbose bool
}

type LoginPayload struct {
	Id string `json:"id"`
}

type LoginResponse struct {
	Data struct {
		Rides []struct {
			Id string `json:"id"`
		} `json:"rides"`
	} `json:"data"`
}

type GenericResponse struct {
	Error struct {
		Message string `json:"message"`
	} `json:"error"`
}

func failOnError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func New(id string, endpoint string) *User {
	jar, err := cookiejar.New(nil)
	if err != nil {
		log.Fatal(err)
	}

	client := &http.Client{
		Jar: jar,
	}

	return &User{
		Id:            id,
		Jar:           jar,
		Client:        client,
		Endpoint:      endpoint,
		GetRandomBike: func() *bike.Bike { return nil },
	}
}

func (u *User) SetVerbose(verbose bool) {
	u.Verbose = verbose
}

func (u *User) SetRandomBikeFunc(getRandomBike GetRandomBikeFunc) {
	u.GetRandomBike = getRandomBike
}

func (u *User) SetCurrentBikeId(id string) {
	u.CurrentBikeId = id
}

func (u *User) Login() error {
	endpoint := fmt.Sprintf("%s/auth/simulation/login", u.Endpoint)

	payload := LoginPayload{
		Id: u.Id,
	}

	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(payloadJSON))
	if err != nil {
		return err
	}

	req.Header.Add("Content-Type", "application/json")

	resp, err := u.Client.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var responseJSON LoginResponse
	err = json.Unmarshal(body, &responseJSON)
	if err != nil {
		return err
	}

	if len(responseJSON.Data.Rides) > 0 {
		u.SetCurrentBikeId(responseJSON.Data.Rides[0].Id)
	}

	return nil
}

func (u *User) Simulate() {
	endpoint := fmt.Sprintf("%s/auth/me", u.Endpoint)

	req, err := http.NewRequest("GET", endpoint, nil)
	failOnError(err)

	resp, err := u.Client.Do(req)
	failOnError(err)

	defer resp.Body.Close()

	for {
		u.SimulateIteration()
	}
}

func (u *User) SimulateIteration() {
	// Things that can happen:
	// 1. Start riding bike    - If not riding
	// 2. Stop riding bike		 - If riding
	// 3. Pause             	 - If not riding
	log.Println("Loop")

	if u.CurrentBikeId == "" {
		switch rand.Intn(1) {
		case 0:
			u.SimulateStartRide()
			u.SimulateRideSleep()
		case 1:
			u.SimulatePauseSleep()
		}
	} else {
		u.SimulateEndRide()
	}
}

func (u *User) SimulateStartRide() {
	bike := u.GetRandomBike()
	if bike == nil {
		return
	}

	endpoint := fmt.Sprintf("%s/bikes/%s/start", u.Endpoint, bike.Id)

	req, err := http.NewRequest("POST", endpoint, nil)
	failOnError(err)

	resp, err := u.Client.Do(req)
	failOnError(err)

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	failOnError(err)

	var responseJSON GenericResponse
	err = json.Unmarshal(body, &responseJSON)
	failOnError(err)

	if responseJSON.Error.Message != "" {
		u.SetCurrentBikeId(bike.Id)
	}
}

func (u *User) SimulateEndRide() {
	if u.CurrentBikeId == "" {
		return
	}

	endpoint := fmt.Sprintf("%s/bikes/%s/end", u.Endpoint, u.CurrentBikeId)

	req, err := http.NewRequest("POST", endpoint, nil)
	failOnError(err)

	resp, err := u.Client.Do(req)
	failOnError(err)

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	failOnError(err)

	var responseJSON GenericResponse
	err = json.Unmarshal(body, &responseJSON)
	failOnError(err)

	if responseJSON.Error.Message != "" {
		u.SetCurrentBikeId("")
	}
}

func (u *User) SimulateRideSleep() {
	min := 2
	max := 8
	seconds := rand.Intn(max-min) + min
	time.Sleep(time.Duration(seconds) * time.Second)
}

func (u *User) SimulatePauseSleep() {
	min := 2
	max := 8
	seconds := rand.Intn(max-min) + min
	time.Sleep(time.Duration(seconds) * time.Second)
}
