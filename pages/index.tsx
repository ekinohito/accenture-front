import { AppBar, Button, CircularProgress, Container, createTheme, Divider, Drawer, Grid, IconButton, LinearProgress, Link, Paper, ScopedCssBaseline, Stack, Toolbar, Typography } from '@mui/material'
import { Box, ThemeProvider } from '@mui/system'
import { Menu, ArrowLeft } from '@mui/icons-material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

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

  function updateFrame() {
    setFrameSrc(`https://loremflickr.com/600/450?random=${Math.random()}`)
    setFrameStatus("pending")
  }

  function resetFrame() {
    updateFrame()
    setTime(0)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => {
        if (time >= 3000) {
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
                <Image width={600} height={450} src={frameSrc} alt="frame" onLoad={() => setFrameStatus("ok")} onError={() => setFrameStatus("error")}/>
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
                onClick={resetFrame}>
                Сделать снимок
              </Button>
              <Button 
                variant="contained"
                color="error"
                size="large"
                onClick={resetFrame}>
                Брак
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={4}>
          <Stack spacing={2} marginTop={4} alignItems="center">
              <Typography variant="h3">Информация</Typography>
              <Box position="relative">
                <Image width={600} height={450} src={numberSrc} alt="number" onLoad={() => setNumberStatus("ok")} onError={() => setNumberStatus("error")}/>
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
              <Typography variant="body1">Распознанный номер вагона: </Typography>
              <Typography variant="body1">Поставщик: </Typography>
              <Typography variant="body1">Уровень доверия: </Typography>
              <Button 
                variant="contained"
                color="primary"
                size="large"
                onClick={() => { setNumberSrc(`https://loremflickr.com/600/450?random=${Math.random()}`); setNumberStatus("pending")}}>
                Скачать отчет
              </Button>
            </Stack>
          </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </ScopedCssBaseline>
  )
}

export default Home
