import { IconButton } from "@mui/material";
import { useCallback, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const ITEM_HEIGHT = 48;

export interface IMenuOptions {
    id: string;
    title: string;
}

interface IMenuProps {
    options: IMenuOptions[];
    onSelect?(option: IMenuOptions): void;
}

export default function LongMenu({options, onSelect} :IMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget), []);
    const handleClose = useCallback(() => setAnchorEl(null), []);
    const selectHandler = useCallback( (option: IMenuOptions) => {
        onSelect?.(option);
        handleClose();
    }, [onSelect, handleClose]);

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{ 'aria-labelledby': 'long-button' }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    },
                }}>
                    {options.map((option) => (
                        <MenuItem key={option.id} onClick={() => selectHandler(option)}> {option.title} </MenuItem>
                    ))}
            </Menu>
        </div>
    );
}
