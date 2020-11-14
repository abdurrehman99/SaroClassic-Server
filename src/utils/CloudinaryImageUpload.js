import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import img from './img.png';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Image } from 'cloudinary-react';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  action: {
    fontSize: ' 8px',
    boxSizing: 'border-box',
    lineHeight: '1.75',
    borderRadius: ' 0px',
    borderColor: '#3D3F4A',
    letterSpacing: '0.02857em',
    color: '#A6A7A8',
    backgroundColor: '#474A5A',
  },
  Button: {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'start',
    color: '#A0A1A4',
    backgroundColor: '#3D3F4A',
    padding: '8px 0px',
  },
  field: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#A0A1A4',
      borderRadius: 'none',
      margin: ' -5px 0px 0px 0px !important',
      padding: '10px !important',
      position: 'absolute !important',
      borderStyle: 'solid !important',
      borderColor: '#A0A1A4 !important',
      borderWidth: '2px !important',
      borderRadius: '0px !important',
      fontSize: '10px !important',
    },
    '& .MuiInputBase-input': {
      font: 'inherit',
      color: 'currentColor',
      width: '100%',
      border: '0',
      height: '1.1876em',
      margin: ' 0',
      fontSize: '10px',
      display: 'block',
      minWidth: '0',
      background: 'none',
    },
    display: 'flex',
    '& .MuiOutlinedInput-input': {
      padding: '3px',
      borderRadius: '0px',
      color: '#A0A1A4',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& .MuiPaper-elevation1': {
      boxShadow: 'none',
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  flexclass: {
    display: 'flex',
    justifyContent: 'center',
  },
}));
toast.configure();

export default function FishInput({ fetchFish, setOpen, open }) {
  const [check, setCheck] = useState('');
  const [checkError, setCHeckError] = useState(false);
  const classes = useStyles();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [energy, setEnergy] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [level, setLevel] = useState('');
  const [imageSelected, setImageSelected] = useState('');
  const [public_id, setPublic_id] = useState('');
  const handleClose = () => {
    setOpen(false);
    fetchFish();
    fetchFish();
    console.log(fetchFish(), 'fetchFish');
  };
  const submit = (e) => {
    e.preventDefault();
    const additems = {
      name: name,
      image: image,
      price: price,
      energy: energy,
      age: age,
      level: level,
    };
    const postData = async () => {
      console.log(additems, 'additems');
      let { name, price, energy, age, image, level } = additems;
      if (
        name == '' ||
        price == '' ||
        age == '' ||
        image == '' ||
        energy == '' ||
        level == ''
      ) {
        setCHeckError('true');
        toast.error('fill the fields, please', {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      } else {
        setCHeckError('false');
      }
      const submit = await axios.post(
        `https://tipply-server.herokuapp.com/marketplace/addTipply`,
        additems,
      );
      setOpen(false);
      console.log(submit);
      setCheck('change');
      toast.success('You have successfully added the Fish', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    };
    postData();
    fetchFish();
  };
  useEffect(() => {
    fetchFish();
    console.log(fetchFish(), 'fetch fish');
  }, check);
  const handleChange = (event) => {
    let { id, value } = event.target;
    if (id === 'name') {
      setName(value);
    }
    setImage(public_id);
    if (event.target.id === 'name') {
      setName(event.target.value);
    }
    if (id === 'price') {
      console.log('check value now==>', id, value < 0, value);
      if (value < 0) {
        return;
      }
      setPrice(Number(value));
    }
    if (id === 'energy') {
      if (value < 0) {
        return;
      }
      setEnergy(Number(value));
    }
    if (id === 'level') {
      if (value < 0) {
        return;
      }
      setLevel(Number(value));
    }
    if (id === 'age') {
      if (value < 0) {
        return;
      }
      setAge(Number(value));
    }
    return null;
  };
  // cloudinary
  const uploadImage = () => {
    const formData = new FormData();
    formData.append('file', imageSelected);
    formData.append('upload_preset', 'nwtronv6');
    const data = async () => {
      await axios
        .post(
          'https://api.cloudinary.com/v1_1/ddoon1hy6/image/upload',
          formData,
        )
        .then((response) => {
          console.log(response.data);
          setPublic_id(response.data.secure_url);
        });
    };
    data();
  };
  {
    /* <div style={{ justifyContent: "start", backgroundColor: "#3D3F4A" }}>
        <img src={img} alt={""} style={{ height: "80px", width: "80px" }} />
      </div> */
  }
  return (
    <>
      <div
        style={{
          justifyContent: 'start',
          backgroundColor: '#3D3F4A',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {public_id !== null ? (
          <Image
            cloudName="ddoon1hy6"
            publicId={public_id}
            style={{ width: '80px', height: '100px' }}
          />
        ) : (
          <img src={img} alt={''} style={{ height: '80px', width: '80px' }} />
        )}
        <br />
        <input
          type="file"
          onChange={(event) => {
            setImageSelected(event.target.files[0]);
          }}
        />
        <br />
        <button
          onClick={uploadImage}
          style={{
            color: 'gray',
            width: 'max-content',
            fontSize: '11px',
            padding: ' 6px 8px',
            backgroundColor: ' #474A5A',
            boxShadow: 'none',
            border: 'none',
          }}
        >
          upload file
        </button>
      </div>
      <form onSubmit={(e) => submit(e)} className={classes.form} noValidate>
        <div className={classes.field}>
          <div style={{ justifyContent: 'center', marginRight: '20px' }}>
            <h4>Amount</h4>
            <TextField
              type="number"
              variant="outlined"
              margin="2px"
              id="price"
              name="id"
              autoFocus
              value={price}
              onChange={handleChange}
            />
          </div>
          <div>
            <h4>Name</h4>
            <TextField
              backgroundColor={'#3D3F4A'}
              name="string"
              variant="outlined"
              margin="2px"
              id="name"
              name="id"
              alignItems="center"
              onChange={handleChange}
            />
          </div>
        </div>
        <br />
        <div className={classes.field}>
          <div style={{ justifyContent: 'center', marginRight: '20px' }}>
            <h4>Age</h4>
            <TextField
              type="number"
              variant="outlined"
              margin="2px"
              id="age"
              name="id"
              autoFocus
              value={age}
              onChange={handleChange}
            />
          </div>
          <div>
            <h4>Energy</h4>
            <TextField
              backgroundColor={'#3D3F4A'}
              name="number"
              variant="outlined"
              margin="2px"
              id="energy"
              name="id"
              alignItems="center"
              onChange={handleChange}
            />
          </div>
        </div>
        <br />
        <div className={classes.field}>
          <div style={{ marginRight: '20px' }}>
            <h4> Level</h4>
            <TextField
              type="number"
              variant="outlined"
              margin="2px"
              id="level"
              value={level}
              name="id"
              autoFocus
              onChange={handleChange}
            />
          </div>
        </div>{' '}
        <br /> <br />
        <DialogActions className={classes.Button}>
          <Button onClick={handleClose} className={classes.action}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleClose}
            className={classes.action}
            style={{ marginLeft: '20px' }}
          >
            Done
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
