package types

import "time"

type GraphConfig struct {
	SrcHeader  string `query:"src"`
	DestHeader string `query:"dest"`
	HideProxy  bool   `query:"hideProxy"`
}

type GraphEntry struct {
	Type    string
	Message string
	From    string
	To      string
	Date    time.Time
}

type GraphHistory []GraphEntry

func (p GraphHistory) Len() int {
	return len(p)
}

func (p GraphHistory) Less(i, j int) bool {
	return p[i].Date.Before(p[j].Date)
}

func (p GraphHistory) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}
