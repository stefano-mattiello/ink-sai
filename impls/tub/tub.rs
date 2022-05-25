// importing everything publicly from traits allows you to import every stuff related to lending
// by one import
pub use super::data::*;
pub use crate::traits::oracle::OracleTraitRef;
use crate::traits::somemath::*;
pub use crate::traits::token::TokenRef;
pub use crate::traits::tub::*;
pub use crate::traits::vox::*;
//use crate::traits::vox::VoxTraitRef;
use brush::{
    contracts::{access_control::*, traits::psp22::PSP22Ref},
    modifiers,
    traits::{AccountId, Balance, Timestamp, ZERO_ADDRESS},
};
use ink_prelude::vec::Vec;
pub const TOP: RoleType = ink_lang::selector_id!("TOP");
pub const MOM: RoleType = ink_lang::selector_id!("MOM");
impl<T: TubStorage + AccessControlStorage + SomeMath> TubTrait for T {
    default fn get_mat(&self) -> u128 {
        TubStorage::get(self).mat
    }
    default fn get_tax(&self) -> u128 {
        TubStorage::get(self).tax
    }
    default fn get_fee(&self) -> u128 {
        TubStorage::get(self).fee
    }
    default fn get_rum(&self) -> u128 {
        TubStorage::get(self).rum
    }
    default fn get_axe(&self) -> u128 {
        TubStorage::get(self).axe
    }
    default fn get_gem(&self) -> AccountId {
        TubStorage::get(self).gem_address
    }
    default fn get_sai(&self) -> AccountId {
        TubStorage::get(self).sai_address
    }
    default fn get_sin(&self) -> AccountId {
        TubStorage::get(self).sin_address
    }
    default fn get_skr(&self) -> AccountId {
        TubStorage::get(self).skr_address
    }
    default fn get_vox(&self) -> AccountId {
        TubStorage::get(self).vox_address
    }
    default fn get_off(&self) -> bool {
        TubStorage::get(self).off
    }
    default fn get_out(&self) -> bool {
        TubStorage::get(self).out
    }
    default fn get_gap(&self) -> u128 {
        TubStorage::get(self).gap
    }
    default fn get_pip(&self) -> AccountId {
        TubStorage::get(self).pip_address
    }
    default fn era(&self) -> Timestamp {
        Self::env().block_timestamp()
    }
    
    

    default fn lad(&self, cup: u128) -> AccountId {
        TubStorage::get(self)
            .cups
            .get(cup)
            .unwrap_or(Cup {
                lad: ZERO_ADDRESS.into(),
                ink: 0,
                art: 0,
                ire: 0,
            })
            .lad
    }
    default fn ink(&self, cup: u128) -> Balance {
        TubStorage::get(self)
            .cups
            .get(cup)
            .unwrap_or(Cup {
                lad: ZERO_ADDRESS.into(),
                ink: 0,
                art: 0,
                ire: 0,
            })
            .ink
    }
    default fn art(&self, cup: u128) -> Balance {
        TubStorage::get(self)
                .cups
                .get(cup)
                .unwrap_or(Cup {
                    lad: ZERO_ADDRESS.into(),
                    ink: 0,
                    art: 0,
                    ire: 0,
                })
                .art
    }
    default fn ire(&self, cup: u128) -> Balance {
        TubStorage::get(self)
                .cups
                .get(cup)
                .unwrap_or(Cup {
                    lad: ZERO_ADDRESS.into(),
                    ink: 0,
                    art: 0,
                    ire: 0,
                })
                .ire
    }
    default fn tab(&mut self, cup: u128) -> Balance {
        let chi = self.get_chi().unwrap();
        let art=TubStorage::get(self)
                .cups
                .get(cup)
                .unwrap_or(Cup {
                    lad: ZERO_ADDRESS.into(),
                    ink: 0,
                    art: 0,
                    ire: 0,
                })
                .art;
        self._rmul(art ,
            chi,
        )
    }
    default fn rap(&mut self, cup: u128) -> u128 {
        let rhi = self.get_rhi().unwrap();
        let tab = self.tab(cup);
        let ire=TubStorage::get(self)
                    .cups
                    .get(cup)
                    .unwrap_or(Cup {
                        lad: ZERO_ADDRESS.into(),
                        ink: 0,
                        art: 0,
                        ire: 0,
                    })
                    .ire;
        self._sub(
            self._rmul(ire,rhi),
            tab,
        )
    }
    default fn din(&mut self) -> u128 {
        let chi = self.get_chi().unwrap();
        self._rmul(TubStorage::get(self).rum, chi)
    }
    default fn air(&self) -> Balance {
        TokenRef::balance_of(&TubStorage::get(self).skr_address, Self::env().account_id())
    }
    default fn pie(&self) -> Balance {
        PSP22Ref::balance_of(&TubStorage::get(self).gem_address, Self::env().account_id())
    }
    #[modifiers(only_role(MOM))]
    default fn mold(&mut self, param: u8, val: u128) -> Result<(), TubError> {
        if param == 1 {
            TubStorage::get_mut(self).cap = val;
        } else if param == 2 {
            if val < self._ray() {
                return Err(TubError::MoldValueNotValid);
            }
            TubStorage::get_mut(self).mat = val;
        } else if param == 3 {
            if val < self._ray() {
                return Err(TubError::MoldValueNotValid);
            }
            self.drip()?;
            TubStorage::get_mut(self).tax = val;
        } else if param == 4 {
            if val < self._ray() {
                return Err(TubError::MoldValueNotValid);
            }
            self.drip()?;
            TubStorage::get_mut(self).fee = val;
        } else if param == 5 {
            if val < self._ray() {
                return Err(TubError::MoldValueNotValid);
            }
            TubStorage::get_mut(self).axe = val;
        } else if param == 6 {
            if val < self._wad() {
                return Err(TubError::MoldValueNotValid);
            }
            TubStorage::get_mut(self).gap = val;
        }
        Ok(())
    }
    #[modifiers(only_role(MOM))]
    default fn set_pip(&mut self, pip_address: AccountId) -> Result<(), TubError> {
        TubStorage::get_mut(self).pip_address = pip_address;
        Ok(())
    }
    #[modifiers(only_role(MOM))]
    default fn set_pep(&mut self, pep_address: AccountId) -> Result<(), TubError> {
        TubStorage::get_mut(self).pep_address = pep_address;
        Ok(())
    }
    #[modifiers(only_role(MOM))]
    default fn set_vox(&mut self, vox_address: AccountId) -> Result<(), TubError> {
        TubStorage::get_mut(self).vox_address = vox_address;
        Ok(())
    }

    default fn turn(&mut self, tap_address: AccountId) -> Result<(), TubError> {
        if TubStorage::get(self).tap != ZERO_ADDRESS.into() || tap_address == ZERO_ADDRESS.into() {
            return Err(TubError::InvalidTurn);
        }
        TubStorage::get_mut(self).tap = tap_address;
        Ok(())
    }
    default fn per(&self) -> u128 {
        let total_skr_supply = TokenRef::total_supply(&TubStorage::get(self).skr_address);
        if total_skr_supply == 0 {
            self._ray()
        } else {
            let pie = self.pie();
            self._rdiv(pie, total_skr_supply)
        }
    }
    default fn ask(&self, wad: u128) -> u128 {
        let per = self.per();
        let gap = TubStorage::get(self).gap;
        let mul = self._wmul(per, gap);
        self._rmul(wad, mul)
    }
    default fn bid(&self, wad: u128) -> u128 {
        let per = self.per();
        self._rmul(
            wad,
            self._wmul(per, self._sub(2 * self._wad(), TubStorage::get(self).gap)),
        )
    }
    default fn join(&mut self, wad: u128) -> Result<(), TubError> {
        if TubStorage::get(self).off {
            return Err(TubError::Paused);
        }
        let amount_of_gem = self.ask(wad);
        if amount_of_gem == 0 {
            return Err(TubError::NotEnoughGem);
        }
        let caller = Self::env().caller();
        let to = Self::env().account_id();
        PSP22Ref::transfer_from_builder(
            &TubStorage::get(self).gem_address,
            caller,
            to,
            amount_of_gem,
            Vec::<u8>::new(),
        ).call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        /*PSP22Ref::transfer_from(
            &TubStorage::get(self).gem_address,
            caller,
            to,
            amount_of_gem,
            Vec::<u8>::new(),
        )?;*/
        TokenRef::mint(
            &TubStorage::get(self).skr_address,
            Self::env().caller(),
            wad,
        )?;
        Ok(())
    }
    default fn exit(&mut self, wad: u128) -> Result<(), TubError> {
        if TubStorage::get(self).off && !(TubStorage::get(self).out) {
            return Err(TubError::Paused);
        }
        let amount_of_gem = self.bid(wad);
        PSP22Ref::transfer_builder(
            &TubStorage::get(self).gem_address,
            Self::env().caller(),
            amount_of_gem,
            Vec::<u8>::new(),
        ).call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        TokenRef::burn(
            &TubStorage::get(self).skr_address,
            Self::env().caller(),
            wad,
        )?;
        Ok(())
    }
    default fn get_chi(&mut self) -> Result<u128, TubError> {
        self.drip()?;
        Ok(TubStorage::get(self).chi)
    }
    default fn get_rhi(&mut self) -> Result<u128, TubError> {
        self.drip()?;
        Ok(TubStorage::get(self).rhi)
    }
    default fn drip(&mut self) -> Result<(), TubError> {
        if TubStorage::get(self).off {
            return Ok(());
        }
        let rho = self.era();
        let age = rho - TubStorage::get(self).rho;
        if age == 0 {
            return Ok(());
        }
        TubStorage::get_mut(self).rho = rho;
        let mut inc = self._ray();
        let mut new_inc;
        if TubStorage::get(self).tax != self._ray() {
            let chi_ = TubStorage::get(self).chi;
            let tax=TubStorage::get(self).tax;
            new_inc = self._rpow(tax,age.into());
            inc = new_inc;
            TubStorage::get_mut(self).chi = self._rmul(chi_, inc);
            TokenRef::mint(
                &TubStorage::get(self).sai_address,
                TubStorage::get(self).tap,
                self._rmul(
                    self._sub(TubStorage::get(self).chi, chi_),
                    TubStorage::get(self).rum,
                ),
            )?;
        }
        if TubStorage::get(self).fee != self._ray() {
        	let fee=TubStorage::get(self).fee;
            new_inc = self._rmul(inc, self._rpow(fee,age.into()));
            inc = new_inc;
        }
        if inc != self._ray() {
            let new_rhi = self._rmul(TubStorage::get(self).rhi, inc);
            TubStorage::get_mut(self).rhi = new_rhi;
        }
        Ok(())
    }

    default fn tag(&self) -> u128 {
        if TubStorage::get(self).off {
            TubStorage::get(self).fit
        } else {
            let per = self.per();

            self._wmul(
                per,
                OracleTraitRef::read(&TubStorage::get(self).pip_address),
            )
        }
    }
    default fn safe(&mut self, cup: u128) -> bool {
        let tag = self.tag();
        let ink = self.ink(cup);
        let pro = self._rmul(tag, ink);
        let tab = self.tab(cup);
        let con = self._rmul(
            VoxTraitRef::get_par(&TubStorage::get(self).vox_address),
            tab,
        );
        let mat = TubStorage::get(self).mat;
        let min = self._rmul(con, mat);
        pro >= min
    }
    default fn open(&mut self) -> Result<u128, TubError> {
        if TubStorage::get(self).off {
            return Err(TubError::Paused);
        }
        let cupi = TubStorage::get(self).cupi;
        TubStorage::get_mut(self).cupi = self._add(cupi, 1);
        let cup = TubStorage::get(self).cupi;
        TubStorage::get_mut(self).cups.insert(
            cup,
            &Cup {
                lad: Self::env().caller(),
                ink: 0,
                art: 0,
                ire: 0,
            },
        );
        Ok(cup)
    }
    default fn give(&mut self, cup: u128, guy: AccountId) -> Result<(), TubError> {
        if Self::env().caller()
            != TubStorage::get(self)
                .cups
                .get(cup)
                .unwrap_or(Cup {
                    lad: ZERO_ADDRESS.into(),
                    ink: 0,
                    art: 0,
                    ire: 0,
                })
                .lad
            || guy == ZERO_ADDRESS.into()
        {
            return Err(TubError::InvalidGiveCup);
        }
        let mut new_cup=TubStorage::get_mut(self).cups.get(cup).clone().unwrap();
        new_cup.lad=guy;
        TubStorage::get_mut(self).cups.insert(cup,&new_cup);
        Ok(())
    }
    default fn lock(&mut self, cup: u128, wad: u128) -> Result<(), TubError> {
        if TubStorage::get(self).off {
            return Err(TubError::Paused);
        }
        let ink = TubStorage::get(self)
            .cups
            .get(cup)
            .unwrap_or(Cup {
                lad: ZERO_ADDRESS.into(),
                ink: 0,
                art: 0,
                ire: 0,
            })
            .ink;
        let new_ink = self._add(ink, wad);
        let mut new_cup=TubStorage::get_mut(self)
            .cups
            .get(cup).clone()
            .unwrap_or(Cup {
                lad: ZERO_ADDRESS.into(),
                ink: 0,
                art: 0,
                ire: 0,
            });
        new_cup.ink=new_ink;
        TubStorage::get_mut(self).cups.insert(cup,&new_cup);
        TokenRef::transfer_from_builder(
            &TubStorage::get(self).skr_address,
            Self::env().caller(),
            Self::env().account_id(),
            wad,
            Vec::<u8>::new(),
        ).call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        Ok(())
    }
    default fn free(&mut self, cup: u128, wad: u128) -> Result<(), TubError> {
        if Self::env().caller()
            != TubStorage::get(self)
                .cups
                .get(cup)
                .unwrap_or(Cup {
                    lad: ZERO_ADDRESS.into(),
                    ink: 0,
                    art: 0,
                    ire: 0,
                })
                .lad
        {
            return Err(TubError::InvalidCup);
        }
        let ink = TubStorage::get(self).cups.get(cup).unwrap().ink;
        let new_ink = self._sub(ink, wad);
        let mut new_cup=TubStorage::get_mut(self).cups.get(cup).clone().unwrap();
        new_cup.ink=new_ink;
        TubStorage::get_mut(self).cups.insert(cup,&new_cup);
        TokenRef::transfer_builder(
            &TubStorage::get(self).skr_address,
            Self::env().caller(),
            wad,
            Vec::<u8>::new(),
        ).call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        if !self.safe(cup) {
            return Err(TubError::CupNotSafe);
        }
        Ok(())
    }

    default fn draw(&mut self, cup: u128, wad: u128) -> Result<(), TubError> {
        if TubStorage::get(self).off {
            return Err(TubError::Paused);
        }
        if Self::env().caller()
            != TubStorage::get(self)
                .cups
                .get(cup)
                .unwrap_or(Cup {
                    lad: ZERO_ADDRESS.into(),
                    ink: 0,
                    art: 0,
                    ire: 0,
                })
                .lad
        {
            return Err(TubError::InvalidCup);
        }
        let chi = self.get_chi().unwrap();
        if self._rdiv(wad, chi) == 0 {
            return Err(TubError::InvalidDraw);
        }
        let art = TubStorage::get(self).cups.get(cup).unwrap().art;
        let new_art = self._add(art, self._rdiv(wad, chi));
        let ire = TubStorage::get(self).cups.get(cup).unwrap().ire;
        let rhi = self.get_rhi().unwrap();
        let new_ire = self._add(ire, self._rdiv(wad, rhi));
        let mut new_cup=TubStorage::get(self).cups.get(cup).clone().unwrap();
	 new_cup.art=new_art;
        new_cup.ire = new_ire;
        TubStorage::get_mut(self).cups.insert(cup,&new_cup);
        let rum = TubStorage::get(self).rum;
        let new_rum = self._add(rum, self._rdiv(wad, chi));
        TubStorage::get_mut(self).rum = new_rum;
        TokenRef::mint(
            &TubStorage::get(self).sai_address,
            Self::env().caller(),
            wad,
        )?;
        if !self.safe(cup)
            || TokenRef::total_supply(&TubStorage::get(self).sai_address)
                > TubStorage::get(self).cap
        {
            return Err(TubError::CupNotSafe);
        }
        Ok(())
    }
    default fn wipe(&mut self, cup: u128, wad: u128) -> Result<(), TubError> {
        if TubStorage::get(self).off {
            return Err(TubError::Paused);
        }
        let rap = self.rap(cup);
        let tab = self.tab(cup);
        let owe = self._rmul(wad, self._rdiv(rap, tab));
        let art = TubStorage::get(self)
            .cups
            .get(cup)
            .unwrap_or(Cup {
                lad: ZERO_ADDRESS.into(),
                ink: 0,
                art: 0,
                ire: 0,
            })
            .art;
        let chi = self.get_chi().unwrap();
        let new_art = self._sub(art, self._rdiv(wad, chi));
        let ire = TubStorage::get(self)
            .cups
            .get(cup)
            .unwrap_or(Cup {
                lad: ZERO_ADDRESS.into(),
                ink: 0,
                art: 0,
                ire: 0,
            })
            .ire;
        let rhi = self.get_rhi().unwrap();
        let new_ire = self._sub(ire, self._rdiv(self._add(wad, owe), rhi));
        let mut new_cup=TubStorage::get(self).cups.get(cup).clone().unwrap();
	new_cup.art=new_art;
        new_cup.ire = new_ire;
        TubStorage::get_mut(self).cups.insert(cup,&new_cup);
     
        let rum = TubStorage::get(self).rum;
        let new_rum = self._sub(rum, self._rdiv(wad, chi));
        TubStorage::get_mut(self).rum = new_rum;
        TokenRef::burn(
            &TubStorage::get(self).sai_address,
            Self::env().caller(),
            wad,
        )?;
        let val = OracleTraitRef::read(&TubStorage::get(self).pep_address);
        if val != 0 {
            PSP22Ref::transfer_from_builder(
                &TubStorage::get(self).gov_address,
                Self::env().caller(),
                TubStorage::get(self).pit,
                self._wdiv(owe, val),
                Vec::<u8>::new(),
            ).call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        }
        Ok(())
    }
    default fn shut(&mut self, cup: u128) -> Result<(), TubError> {
        if TubStorage::get(self).off {
            return Err(TubError::Paused);
        }
        if Self::env().caller()
            != TubStorage::get(self)
                .cups
                .get(cup)
                .unwrap_or(Cup {
                    lad: ZERO_ADDRESS.into(),
                    ink: 0,
                    art: 0,
                    ire: 0,
                })
                .lad
        {
            return Err(TubError::InvalidCup);
        }
        let tab = self.tab(cup);
        if tab != 0 {
            self.wipe(cup, tab)?;
        }
        let ink = self.ink(cup);
        if ink != 0 {
            self.free(cup, ink)?;
        }
        TubStorage::get_mut(self).cups.remove(cup);
        Ok(())
    }
    default fn bite(&mut self, cup: u128) -> Result<(), TubError> {
        if self.safe(cup) && !TubStorage::get(self).off {
            return Err(TubError::InvalidBite);
        }
        let rue = self.tab(cup);
        TokenRef::mint(
            &TubStorage::get(self).sin_address,
            TubStorage::get(self).tap,
            rue,
        )?;
        let rum = TubStorage::get(self).rum;
        let art = TubStorage::get(self)
            .cups
            .get(cup)
            .unwrap_or(Cup {
                lad: ZERO_ADDRESS.into(),
                ink: 0,
                art: 0,
                ire: 0,
            })
            .art;
        let new_rum = self._sub(rum, art);
        TubStorage::get_mut(self).rum = new_rum;
        let mut new_cup=TubStorage::get_mut(self)
            .cups
            .get(cup).clone()
            .unwrap_or(Cup {
                lad: ZERO_ADDRESS.into(),
                ink: 0,
                art: 0,
                ire: 0,
            });
        new_cup.art=0;
        new_cup.ire=0;
        TubStorage::get_mut(self).cups.insert(cup,&new_cup);
        let tag = self.tag();
        let par = VoxTraitRef::get_par(&TubStorage::get(self).vox_address);
        let axe = TubStorage::get(self).axe;
        let mut owe = self._rdiv(self._rmul(self._rmul(rue, axe), par), tag);
        let ink = TubStorage::get(self)
            .cups
            .get(cup)
            .unwrap_or(Cup {
                lad: ZERO_ADDRESS.into(),
                ink: 0,
                art: 0,
                ire: 0,
            })
            .ink;
        if owe > ink {
            owe = ink;
        }
        TokenRef::transfer_builder(
            &TubStorage::get(self).skr_address,
            TubStorage::get(self).tap,
            owe,
            Vec::<u8>::new(),
        ).call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        let new_ink= self._sub(ink, owe);
        let mut new_cup2=TubStorage::get(self).cups.get(cup).clone().unwrap();
	 new_cup2.ink=new_ink;
        TubStorage::get_mut(self).cups.insert(cup,&new_cup2);
        Ok(())
    }
    #[modifiers(only_role(TOP))]
    default fn cage(&mut self, fit: u128, jam: u128) -> Result<(), TubError> {
        if TubStorage::get(self).off || fit == 0 {
            return Err(TubError::InvalidCage);
        }
        TubStorage::get_mut(self).off = true;
        TubStorage::get_mut(self).axe = self._ray();
        TubStorage::get_mut(self).gap = self._wad();
        TubStorage::get_mut(self).fit = fit;
        PSP22Ref::transfer_builder(
            &TubStorage::get(self).gem_address,
            TubStorage::get(self).tap,
            jam,
            Vec::<u8>::new(),
        ).call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        Ok(())
    }
    #[modifiers(only_role(TOP))]
    default fn flow(&mut self) -> Result<(), TubError> {
        if !TubStorage::get(self).off {
            return Err(TubError::NotPaused);
        }
        TubStorage::get_mut(self).out = true;
        Ok(())
    }
}
