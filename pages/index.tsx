import { AppBar, Button, CircularProgress, Container, createTheme, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, Grid, IconButton, ImageList, ImageListItem, LinearProgress, Link, Paper, ScopedCssBaseline, Stack, Toolbar, Typography } from '@mui/material'
import { Box, ThemeProvider } from '@mui/system'
import { Menu, ArrowLeft, ThumbUp, ThumbDown } from '@mui/icons-material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: "#aa10fe"
    }
  },
  typography: {
    fontFamily: 'Montserrat,"Arial","Sans-Serif"'
  }
})

const Home: NextPage = () => {
  const [numberSrc, setNumberSrc] = useState("/placeholder.png")
  const [numberStatus, setNumberStatus] = useState<"ok" | "pending" | "error">("ok")
  const [frameSrc, setFrameSrc] = useState("/placeholder.png")
  const [frameStatus, setFrameStatus] = useState<"ok" | "pending" | "error">("ok")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [time, setTime] = useState(100)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [numberResult, setNumberResult] = useState("")
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [failedFrame, setFailedFrame] = useState<null | {src: string, amount?: number}>(null)
  const [gallery, setGallery] = useState<string[]>([])

  async function updateNumber() {
    const res = await fetch('http://localhost:8000/number')
    const data = await res.json()
    setNumberStatus("pending")
    setNumberSrc(`http://localhost:8000/${data.url}?r=${Math.random()}`)
    setNumberResult(data.code)
  }

  async function updateFrame() {
    setFrameStatus("pending")
    const res = await fetch('http://localhost:8000/frame')
    const data = await res.json()
    setFrameSrc(`http://localhost:8000/${data.url}?r=${Math.random()}`)
    if (data.amount) {
      setIsPopupOpen(true)
      setFailedFrame({src: `http://localhost:8000/${data.url}?r=${Math.random()}`, amount: data.amount})
    }
  }

  async function resetFrame() {
    updateFrame()
    updateNumber()
    setTime(0)
  }

  const autoplay = useRef(true)
  useEffect(() => {
    autoplay.current = (numberStatus !== "pending" && frameStatus !== "pending") && !isPopupOpen
  }, [numberStatus, frameStatus, isPopupOpen])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => {
        if (!autoplay.current) return time
        if (time >= 3000) {
          updateNumber()
          updateFrame()
          return 0
        }
        return time + 100
      })
      setCurrentDate(new Date())
    }, 100)
    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <ScopedCssBaseline>
      <ThemeProvider theme={theme}>
        <Head>
          <title>5 Денег</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <AppBar position="sticky">
          <Container>
            <Toolbar>
              <IconButton onClick={() => setIsMenuOpen(isOpen => !isOpen)}>
                <Menu color="disabled"/>
              </IconButton>
              <Typography variant="h4" fontWeight="">5 Денег</Typography>
            </Toolbar>
          </Container>
        </AppBar> 
        <Drawer variant="persistent" open={isMenuOpen}>
          <IconButton sx={{alignSelf: "end"}} onClick={() => setIsMenuOpen(false)}>
            <ArrowLeft />
          </IconButton>
          <Divider sx={{minWidth: "300px"}}/>
          <Stack spacing={1} margin={4}>
            <Link variant="h5" href="#">Зона А</Link>
            <Link variant="h5">Зона Б</Link>
            <Link variant="h5">Зона В</Link>
            <Link variant="h5">Галлерея</Link>
          </Stack>
        </Drawer>
        <Dialog open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
          <DialogTitle>Подтвердите наличие брака</DialogTitle>
          <DialogContent>
            {frameStatus === "ok" && <img width={550} height={600} style={{objectFit: 'contain'}} src={failedFrame?.src ?? ""}/>}
            {failedFrame?.amount && <Typography variant="body1" color="error">Оценка брака системой: {failedFrame?.amount}%</Typography>}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => setIsPopupOpen(false)}>Отмена</Button>
            <Button color="error" onClick={() => setIsPopupOpen(false)}>Брак</Button>
          </DialogActions>
        </Dialog>
        <Container>
          <Grid container>
            <Grid item xs={8} textAlign="center" marginTop={4}>
            <Typography variant="body1">
              Зона А /
              Плановое время: 12:00-13:00 /
              Время сейчас: {currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds()}
            </Typography>
            </Grid>
            <Grid item xs={8}>
              <Stack spacing={2} marginTop={4} alignItems="center">
                <Typography variant="h3">Кадры</Typography>
                <Box position="relative">
                  <img width={600} height={450} style={{objectFit: 'contain'}} src={frameSrc} alt="frame" onLoad={() => setFrameStatus("ok")} onError={() => setFrameStatus("error")}/>
                  <Box
                  position="absolute" 
                  top="0" 
                  left="0" 
                  width="100%" 
                  height="100%" 
                  display={frameStatus === "pending" ? "grid" : "none"}
                  alignContent="center" 
                  justifyContent="center" 
                  sx={{backdropFilter: "blur(4px)"}}><CircularProgress/></Box>
                  <LinearProgress value={time / 20 - 35} variant="determinate"/>
                </Box>
                <Button 
                  variant="contained"
                  size="large"
                  onClick={resetFrame}>
                  Обновить изображение
                </Button>
                <Button 
                  variant="contained"
                  size="large"
                  onClick={() => {setGallery(gallery => [...gallery, frameSrc])}}>
                  Сделать снимок
                </Button>
                <Button 
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={() => {setFailedFrame({src: frameSrc});setIsPopupOpen(true)}}>
                  Брак
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={4}>
            <Stack spacing={2} marginTop={4} alignItems="center">
                <Typography variant="h3">Информация</Typography>
                <Box position="relative">
                  <img width={300} height={200}  style={{objectFit: 'contain'}} src={numberSrc} alt="number" onLoad={() => setNumberStatus("ok")} onError={() => setNumberStatus("error")}/>
                  <Box
                  position="absolute" 
                  top="0" 
                  left="0" 
                  width="100%" 
                  height="100%" 
                  display={numberStatus === "pending" ? "grid" : "none"}
                  alignContent="center" 
                  justifyContent="center" 
                  sx={{backdropFilter: "blur(4px)"}}><CircularProgress/></Box>
                  
                </Box>
                {numberStatus === "ok" && <> 
                  <Typography variant="body1" textAlign="center">Распознанный номер вагона: <br/>{numberResult}
                  <IconButton color="success"><ThumbUp/></IconButton><IconButton color="error"><ThumbDown/></IconButton>
                  </Typography>
                  <Typography variant="body1">Поставщик: </Typography>
                  <Typography variant="body1">Уровень доверия: </Typography>
                </>}
                <Button 
                  variant="contained"
                  color="primary"
                  size="large">
                  Скачать отчет
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              {gallery.length > 0 && <Typography variant="h3">Галерея</Typography>}
              <ImageList>
                {gallery.map(src => <ImageListItem key={src}>
                  <img src={src}/>
                </ImageListItem>)}
              </ImageList>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </ScopedCssBaseline>
  )
}

export default Home
