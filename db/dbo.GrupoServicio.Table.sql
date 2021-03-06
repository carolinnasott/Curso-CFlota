USE [SISEP_ControlFlota]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GrupoServicio](
	[grusId] [int] IDENTITY(1,1) NOT NULL,
	[grusGrupId] [int] NULL,
	[grusServId] [int] NULL,
	[grusPeriodo] [int] NULL,
	[grusKM] [int] NULL,
	[grusFecha] [bit] NULL,
	[grusFechaAlta] [datetime] NULL,
	[grusBorrado] [bit] NOT NULL,
 CONSTRAINT [PK_GrupoServicio] PRIMARY KEY CLUSTERED 
(
	[grusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
